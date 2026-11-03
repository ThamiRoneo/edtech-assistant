from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel, ConfigDict
from typing import Optional

from app.core.db import get_db
from app.core.security import get_current_user
from app.core.errors import NotFoundError
from app.models.user import User
from app.models.assessment import Assessment, AssessmentItem
from app.models.mastery import Mastery
from app.schemas.pagination import PaginationParams, PaginatedResponse

router = APIRouter()


class GenReq(BaseModel):
    model_config = ConfigDict()
    topic_id: Optional[str] = None
    count: int = 5


@router.post("/generate")
def generate(req: GenReq, db: Session = Depends(get_db), user=Depends(get_current_user)):
    clerk_id = user.get("sub")
    u = db.query(User).filter(User.clerk_id == clerk_id).first()
    if not u:
        raise NotFoundError("User not found")
    difficulty = 0.5
    if req.topic_id:
        m = db.query(Mastery).filter(Mastery.user_id == u.id, Mastery.topic_id == req.topic_id).first()
        if m and m.score is not None:
            # lower mastery -> higher difficulty
            difficulty = max(0.2, min(0.9, 1.0 - m.score))
    a = Assessment(user_id=u.id, topic_id=req.topic_id, difficulty=difficulty, status="ready")
    db.add(a)
    db.commit()
    db.refresh(a)
    templates = [
        "Solve: {x} + {y} = ?",
        "Simplify: {x}/{y}",
        "Find x: {x}*{y} = {z}",
    ]
    import random
    for i in range(req.count):
        t = templates[i % len(templates)]
        q = t.format(x=random.randint(1,10), y=random.randint(1,10), z=random.randint(10,100))
        item = AssessmentItem(assessment_id=a.id, question_text=q, choices=["A", "B", "C", "D"], correct_answer="A", explanation="Review steps")
        db.add(item)
    db.commit()
    items = db.query(AssessmentItem).filter(AssessmentItem.assessment_id == a.id).all()
    return {"assessment_id": str(a.id), "difficulty": difficulty, "items": [{"id": str(it.id), "question_text": it.question_text, "choices": it.choices} for it in items]}


@router.get("/bank")
def get_bank(page: PaginationParams = Depends(), db: Session = Depends(get_db)):
    from app.services.question_bank import MATH_QUESTIONS
    total = len(MATH_QUESTIONS)
    items = MATH_QUESTIONS[page.offset:page.offset + page.limit]
    return {"items": items, "total": total, "limit": page.limit, "offset": page.offset}


@router.get("/assessments")
def list_assessments(page: PaginationParams = Depends(), db: Session = Depends(get_db), user=Depends(get_current_user)):
    clerk_id = user.get("sub")
    u = db.query(User).filter(User.clerk_id == clerk_id).first()
    if not u:
        raise NotFoundError("User not found")
    q = db.query(Assessment).filter(Assessment.user_id == u.id).order_by(Assessment.created_at.desc())
    total = q.count()
    items = q.offset(page.offset).limit(page.limit).all()
    return {"items": [{"id": str(a.id), "topic_id": a.topic_id, "difficulty": a.difficulty, "status": a.status} for a in items], "total": total, "limit": page.limit, "offset": page.offset}


@router.post("/{assessment_id}/submit")
def submit_assessment(assessment_id: str, answers: dict, db: Session = Depends(get_db), user=Depends(get_current_user)):
    items = db.query(AssessmentItem).filter(AssessmentItem.assessment_id == assessment_id).all()
    score = 0
    total = len(items) or 1
    for it in items:
        ans = answers.get(str(it.id))
        if ans and it.correct_answer and ans == it.correct_answer:
            score += 1
    return {"score": score, "total": total, "percentage": score / total}
