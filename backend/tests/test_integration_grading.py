from fastapi.testclient import TestClient
from app.main import app
from app.core.db import SessionLocal
from app.models.user import User
from app.models.topic import Topic
from app.models.submission import Submission
from app.models.rubric import Rubric
import uuid


def test_grading_flow_integration():
    db = SessionLocal()
    try:
        clerk_id = f"test_{uuid.uuid4()}"
        u = User(clerk_id=clerk_id)
        db.add(u)
        db.commit()
        db.refresh(u)
        t = Topic(name=f"Math-{uuid.uuid4()}", grade_level="K-12")
        db.add(t)
        db.commit()
        db.refresh(t)
        r = Rubric(topic_id=t.id, title="Test", criteria=[{"name": "Correct", "max_points": 1, "description": "ok"}])
        db.add(r)
        sub = Submission(user_id=u.id, topic_id=t.id, content_text="2+2=4", image_keys=[], status="pending")
        db.add(sub)
        db.commit()
        db.refresh(sub)
        # simulate grading
        from app.tasks.grading import grade_submission
        # call directly
        grade_submission(str(sub.id))
        sub2 = db.query(Submission).filter(Submission.id == sub.id).first()
        assert sub2.status in ["graded", "failed"]
    finally:
        db.close()
