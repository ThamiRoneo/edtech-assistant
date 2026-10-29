from sqlalchemy import Column, String, DateTime, func, ForeignKey, JSON, Float, Index
from sqlalchemy.dialects.postgresql import UUID
import uuid

from app.core.db import Base


class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    topic_id = Column(UUID(as_uuid=True), ForeignKey("topics.id"))
    difficulty = Column(Float)
    status = Column(String, default="pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        Index('idx_assessments_user_created', 'user_id', 'created_at'),
        Index('idx_assessments_topic', 'topic_id'),
    )


class AssessmentItem(Base):
    __tablename__ = "assessment_items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    assessment_id = Column(UUID(as_uuid=True), ForeignKey("assessments.id"))
    question_text = Column(String)
    choices = Column(JSON)
    correct_answer = Column(String)
    explanation = Column(String)

    __table_args__ = (
        Index('idx_assessment_items_assessment', 'assessment_id'),
    )
