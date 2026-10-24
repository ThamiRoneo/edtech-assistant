from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.mastery import Mastery
from app.models.topic import Topic

router = APIRouter()


@router.get("/")
def get_mastery(db: Session = Depends(get_db), user=Depends(get_current_user)):
    clerk_id = user.get("sub")
    u = db.query(User).filter(User.clerk_id == clerk_id).first()
    if not u:
        return []
    rows = db.query(Mastery, Topic).join(Topic, Topic.id == Mastery.topic_id).filter(Mastery.user_id == u.id).all()
    return [{"topic_id": str(m.topic_id), "topic": t.name, "score": m.score, "attempts": m.attempts} for m, t in rows]


@router.get("/gaps")
def get_gaps(threshold: float = 0.6, db: Session = Depends(get_db), user=Depends(get_current_user)):
    clerk_id = user.get("sub")
    u = db.query(User).filter(User.clerk_id == clerk_id).first()
    if not u:
        return []
    rows = db.query(Mastery, Topic).join(Topic, Topic.id == Mastery.topic_id).filter(Mastery.user_id == u.id, Mastery.score < threshold).all()
    return [{"topic_id": str(m.topic_id), "topic": t.name, "score": m.score} for m, t in rows]
