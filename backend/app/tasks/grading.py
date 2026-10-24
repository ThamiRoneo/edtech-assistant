from app.tasks.celery_app import celery_app
from app.core.db import SessionLocal
from app.models.submission import Submission
from app.models.mark import Mark
from app.models.rubric import Rubric
from app.models.mastery import Mastery
from app.models.topic import Topic
import json


@celery_app.task(bind=True, max_retries=3, default_retry_delay=60)
def grade_submission(self, submission_id: str):
    db = SessionLocal()
    try:
        sub = db.query(Submission).filter(Submission.id == submission_id).first()
        if not sub:
            return
        sub.status = "grading"
        db.commit()

        # TODO: call LLM vision + rubric; for now stub
        rubric = db.query(Rubric).filter(Rubric.topic_id == sub.topic_id).first()
        scores = []
        if rubric and rubric.criteria:
            for c in rubric.criteria:
                scores.append({"name": c.get("name"), "score": c.get("max_points", 1), "max": c.get("max_points", 1)})
        total = sum(s["score"] for s in scores) if scores else 0
        maxs = sum(s["max"] for s in scores) if scores else 0 or 1

        mark = Mark(submission_id=sub.id, rubric_id=rubric.id if rubric else None, scores=scores, total_score=total, max_score=maxs, feedback="Stub feedback")
        db.add(mark)
        sub.status = "graded"

        # transactional mastery update (EMA)
        if sub.topic_id:
            m = db.query(Mastery).filter(Mastery.user_id == sub.user_id, Mastery.topic_id == sub.topic_id).first()
            if not m:
                m = Mastery(user_id=sub.user_id, topic_id=sub.topic_id, score=total / maxs, attempts=1)
                db.add(m)
            else:
                alpha = 0.3
                m.score = alpha * (total / maxs) + (1 - alpha) * m.score
                m.attempts = (m.attempts or 0) + 1
        db.commit()
    except Exception as e:
        db.rollback()
        sub = db.query(Submission).filter(Submission.id == submission_id).first()
        if sub:
            sub.status = "failed"
            db.commit()
        raise self.retry(exc=e)
    finally:
        db.close()
