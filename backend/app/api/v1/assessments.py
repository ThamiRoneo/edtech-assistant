from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from app.core.db import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.assessment import Assessment, AssessmentItem
from app.models.mastery import Mastery

router = APIRouter()


class GenReq(BaseModel):
    topic_id: Optional[str] = None
    count: int = 5


@router.post("/generate")
def generate(req: GenReq, db: Session = Depends(get_db), user=Depends(get_current_user)):
    clerk_id = user.get("sub")
    u = db.query(User).filter(User.clerk_id == clerk_id).first()
    if not u:
        return {"error": "user not found"}
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
def get_bank():
    from app.services.question_bank import MATH_QUESTIONS
    return {"questions": MATH_QUESTIONS}


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
