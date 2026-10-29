from fastapi import APIRouter, Depends, HTTPException, Header, Query, Request
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.db import get_db
from app.core.security import get_current_user
from app.core.errors import NotFoundError, ValidationError, ConflictError
from app.core.rate_limit import rate_limit
from app.schemas.submission import SubmissionCreate, SubmissionOut
from app.schemas.pagination import PaginationParams, PaginatedResponse
from app.models.submission import Submission
from app.models.user import User
from app.tasks.grading import grade_submission
from redis import Redis
import json
import hashlib

router = APIRouter()

try:
    redis_client = Redis.from_url("redis://localhost:6379/0", decode_responses=True)
except Exception:
    redis_client = None


@router.post("/", response_model=SubmissionOut)
@rate_limit(max_requests=20, window_seconds=60)
def create_submission(
    data: SubmissionCreate,
    request: Request,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
    idempotency_key: Optional[str] = Header(None, alias="Idempotency-Key"),
):
    clerk_id = user.get("sub")
    u = db.query(User).filter(User.clerk_id == clerk_id).first()
    if not u:
        u = User(clerk_id=clerk_id, email=user.get("email"))
        db.add(u)
        db.commit()
        db.refresh(u)

    if idempotency_key and redis_client:
        request_hash = hashlib.sha256(json.dumps(data.model_dump(), sort_keys=True).encode()).hexdigest()
        key = f"idempotency:submission:{idempotency_key}"
        existing = redis_client.get(key)
        if existing:
            cached = json.loads(existing)
            if cached.get("request_hash") != request_hash:
                raise ConflictError("Idempotency key reused with different payload")
            if cached.get("status") == "in_progress":
                raise ConflictError("Request in progress")
            if cached.get("status") == "succeeded":
                return json.loads(cached["response"])
        redis_client.setex(key, 3600, json.dumps({"status": "in_progress", "request_hash": request_hash}))

    sub = Submission(
        user_id=u.id,
        topic_id=data.topic_id,
        content_text=data.content_text,
        image_keys=data.image_keys or [],
        status="pending",
    )
    db.add(sub)
    db.commit()
    db.refresh(sub)
    grade_submission.delay(str(sub.id))

    if idempotency_key and redis_client:
        key = f"idempotency:submission:{idempotency_key}"
        redis_client.setex(key, 3600, json.dumps({"status": "succeeded", "request_hash": request_hash, "response": json.dumps(SubmissionOut.model_validate(sub).model_dump(), default=str)}))

    return sub


@router.get("/", response_model=PaginatedResponse[SubmissionOut])
def list_submissions(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    clerk_id = user.get("sub")
    u = db.query(User).filter(User.clerk_id == clerk_id).first()
    if not u:
        return PaginatedResponse.create([], 0, page, page_size)
    query = db.query(Submission).filter(Submission.user_id == u.id).order_by(Submission.created_at.desc())
    total_items = query.count()
    items = query.offset((page - 1) * page_size).limit(page_size).all()
    return PaginatedResponse.create(items, total_items, page, page_size)


@router.get("/{submission_id}", response_model=SubmissionOut)
def get_submission(submission_id: str, db: Session = Depends(get_db), user=Depends(get_current_user)):
    clerk_id = user.get("sub")
    u = db.query(User).filter(User.clerk_id == clerk_id).first()
    sub = db.query(Submission).filter(Submission.id == submission_id).first()
    if not sub or not u or sub.user_id != u.id:
        raise NotFoundError("Submission not found")
    return sub
