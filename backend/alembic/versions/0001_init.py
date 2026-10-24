"""init

Revision ID: 0001
Revises: 
Create Date: 2026-10-24 13:50:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
from pgvector.sqlalchemy import Vector

# revision identifiers, used by Alembic.
revision = '0001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute('CREATE EXTENSION IF NOT EXISTS vector')
    op.create_table(
        'users',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('clerk_id', sa.String(), nullable=False),
        sa.Column('email', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_clerk_id'), 'users', ['clerk_id'], unique=True)
    op.create_table(
        'topics',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('grade_level', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('name')
    )
    op.create_table(
        'rubrics',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('topic_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('title', sa.String(), nullable=True),
        sa.Column('criteria', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['topic_id'], ['topics.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_table(
        'submissions',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('topic_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('content_text', sa.Text(), nullable=True),
        sa.Column('image_keys', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('status', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['topic_id'], ['topics.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_table(
        'assessments',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('topic_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('difficulty', sa.Float(), nullable=True),
        sa.Column('status', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['topic_id'], ['topics.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_table(
        'knowledge_chunks',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('source', sa.String(), nullable=True),
        sa.Column('content', sa.Text(), nullable=True),
        sa.Column('embedding', Vector(1536), nullable=True),
        sa.Column('metadata', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_table(
        'marks',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('submission_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('rubric_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('scores', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('total_score', sa.Float(), nullable=True),
        sa.Column('max_score', sa.Float(), nullable=True),
        sa.Column('feedback', sa.Text(), nullable=True),
        sa.Column('graded_by', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['rubric_id'], ['rubrics.id'], ),
        sa.ForeignKeyConstraint(['submission_id'], ['submissions.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('submission_id')
    )
    op.create_table(
        'mastery',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('topic_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('score', sa.Float(), nullable=True),
        sa.Column('attempts', sa.Float(), nullable=True),
        sa.Column('last_updated', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['topic_id'], ['topics.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id', 'topic_id')
    )
    op.create_table(
        'assessment_items',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('assessment_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('question_text', sa.String(), nullable=True),
        sa.Column('choices', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('correct_answer', sa.String(), nullable=True),
        sa.Column('explanation', sa.String(), nullable=True),
        sa.ForeignKeyConstraint(['assessment_id'], ['assessments.id'], ),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade() -> None:
    op.drop_table('assessment_items')
    op.drop_table('mastery')
    op.drop_table('marks')
    op.drop_table('knowledge_chunks')
    op.drop_table('assessments')
    op.drop_table('submissions')
    op.drop_table('rubrics')
    op.drop_table('topics')
    op.drop_index(op.f('ix_users_clerk_id'), table_name='users')
    op.drop_table('users')
    op.execute('DROP EXTENSION IF EXISTS vector')
