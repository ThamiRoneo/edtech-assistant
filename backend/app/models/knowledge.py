from sqlalchemy import Column, String, DateTime, func, Text
from sqlalchemy.dialects.postgresql import UUID
from pgvector.sqlalchemy import Vector
import uuid

from app.core.db import Base


class KnowledgeChunk(Base):
    __tablename__ = "knowledge_chunks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    source = Column(String)
    content = Column(Text)
    embedding = Column(Vector(1536))
    metadata_ = Column("metadata", Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
