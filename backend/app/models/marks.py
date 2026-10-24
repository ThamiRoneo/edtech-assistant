from sqlalchemy import Column, DateTime, func, ForeignKey, JSON, Float, Text
from sqlalchemy.dialects.postgresql import UUID
import uuid

from app.core.db import Base


class Mark(Base):
    __tablename__ = "marks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    submission_id = Column(UUID(as_uuid=True), ForeignKey("submissions.id"), unique=True)
    rubric_id = Column(UUID(as_uuid=True), ForeignKey("rubrics.id"))
    scores = Column(JSON)  # per criterion
    total_score = Column(Float)
    max_score = Column(Float)
    feedback = Column(Text)
    graded_by = Column(String, default="llm")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
