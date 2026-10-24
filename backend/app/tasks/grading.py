from app.tasks.celery_app import celery_app
from app.core.db import SessionLocal
from app.models.submission import Submission
from app.models.marks import Mark
from app.models.rubric import Rubric
from app.models.mastery import Mastery
import asyncio

from app.services.grading import grading_service


@celery_app.task(bind=True, max_retries=3, default_retry_delay=60)
def grade_submission(self, submission_id: str):
    db = SessionLocal()
    try:
        sub = db.query(Submission).filter(Submission.id == submission_id).first()
        if not sub:
            return
        sub.status = "grading"
        db.commit()

        rubric = db.query(Rubric).filter(Rubric.topic_id == sub.topic_id).first()
        rubric_criteria = rubric.criteria if rubric and rubric.criteria else []

        try:
            loop = asyncio.get_event_loop()
        except Exception:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
        result = loop.run_until_complete(
            grading_service.grade(sub.content_text, sub.image_keys or [], rubric_criteria)
        )

        mark = Mark(
            submission_id=sub.id,
            rubric_id=rubric.id if rubric else None,
            scores=result.get("scores", []),
            total_score=result.get("total_score", 0),
            max_score=result.get("max_score", 1) or 1,
            feedback=result.get("feedback", ""),
            graded_by="llm",
        )
        db.add(mark)
        sub.status = "graded"

        if sub.topic_id and mark.max_score and mark.max_score > 0:
            m = db.query(Mastery).filter(Mastery.user_id == sub.user_id, Mastery.topic_id == sub.topic_id).first()
            ratio = mark.total_score / mark.max_score
            if not m:
                m = Mastery(user_id=sub.user_id, topic_id=sub.topic_id, score=ratio, attempts=1)
                db.add(m)
            else:
                alpha = 0.3
                m.score = alpha * ratio + (1 - alpha) * (m.score or 0)
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
