from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.db import get_db
from app.core.security import get_current_user
from app.schemas.submission import SubmissionCreate, SubmissionOut
from app.models.submission import Submission
from app.models.user import User
from app.tasks.grading import grade_submission

router = APIRouter()


@router.post("/", response_model=SubmissionOut)
def create_submission(data: SubmissionCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    # ensure user exists
    clerk_id = user.get("sub")
    u = db.query(User).filter(User.clerk_id == clerk_id).first()
    if not u:
        u = User(clerk_id=clerk_id, email=user.get("email"))
        db.add(u)
        db.commit()
        db.refresh(u)

    sub = Submission(user_id=u.id, topic_id=data.topic_id, content_text=data.content_text, image_keys=data.image_keys or [], status="pending")
    db.add(sub)
    db.commit()
    db.refresh(sub)
    grade_submission.delay(str(sub.id))
    return sub


@router.get("/", response_model=List[SubmissionOut])
def list_submissions(db: Session = Depends(get_db), user=Depends(get_current_user)):
    clerk_id = user.get("sub")
    u = db.query(User).filter(User.clerk_id == clerk_id).first()
    if not u:
        return []
    return db.query(Submission).filter(Submission.user_id == u.id).order_by(Submission.created_at.desc()).all()


@router.get("/{submission_id}", response_model=SubmissionOut)
def get_submission(submission_id: str, db: Session = Depends(get_db), user=Depends(get_current_user)):
    clerk_id = user.get("sub")
    u = db.query(User).filter(User.clerk_id == clerk_id).first()
    sub = db.query(Submission).filter(Submission.id == submission_id).first()
    if not sub or not u or sub.user_id != u.id:
        raise HTTPException(status_code=404, detail="Not found")
    return sub
