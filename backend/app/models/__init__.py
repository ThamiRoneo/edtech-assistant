from app.core.db import Base
from app.models.user import User
from app.models.submission import Submission
from app.models.rubric import Rubric
from app.models.marks import Mark
from app.models.topic import Topic
from app.models.mastery import Mastery
from app.models.assessment import Assessment, AssessmentItem
from app.models.knowledge import KnowledgeChunk

__all__ = ["Base", "User", "Submission", "Rubric", "Mark", "Topic", "Mastery", "Assessment", "AssessmentItem", "KnowledgeChunk"]
