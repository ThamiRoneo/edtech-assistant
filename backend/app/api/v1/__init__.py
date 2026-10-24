from fastapi import APIRouter

from app.api.v1 import submissions, mastery, assessments, tutor, knowledge

router = APIRouter()
router.include_router(submissions.router, prefix="/submissions", tags=["submissions"])
router.include_router(mastery.router, prefix="/mastery", tags=["mastery"])
router.include_router(assessments.router, prefix="/assessments", tags=["assessments"])
router.include_router(tutor.router, prefix="/tutor", tags=["tutor"])
router.include_router(knowledge.router, prefix="/knowledge", tags=["knowledge"])
