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
            difficulty = max(0.2, min(0.9, 1.0 - m.score))
    a = Assessment(user_id=u.id, topic_id=req.topic_id, difficulty=difficulty, status="ready")
    db.add(a)
    db.commit()
    db.refresh(a)
    for i in range(req.count):
        item = AssessmentItem(assessment_id=a.id, question_text=f"Practice question {i+1} (diff {difficulty:.2f})", choices=["A", "B", "C", "D"], correct_answer="A", explanation="Stub")
        db.add(item)
    db.commit()
    items = db.query(AssessmentItem).filter(AssessmentItem.assessment_id == a.id).all()
    return {"assessment_id": str(a.id), "difficulty": difficulty, "items": [{"id": str(it.id), "question_text": it.question_text, "choices": it.choices} for it in items]}
