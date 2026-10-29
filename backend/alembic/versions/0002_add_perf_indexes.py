"""add_perf_indexes

Revision ID: 0002
Revises: 0001
Create Date: 2026-10-29 20:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0002'
down_revision = '0001'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_index('idx_assessments_user_created', 'assessments', ['user_id', 'created_at'])
    op.create_index('idx_assessments_topic', 'assessments', ['topic_id'])
    op.create_index('idx_assessment_items_assessment', 'assessment_items', ['assessment_id'])
    op.create_index('idx_submissions_user_created', 'submissions', ['user_id', 'created_at'])
    op.create_index('idx_submissions_status', 'submissions', ['status'])
    op.create_index('idx_mastery_user', 'mastery', ['user_id'])


def downgrade() -> None:
    op.drop_index('idx_mastery_user', table_name='mastery')
    op.drop_index('idx_submissions_status', table_name='submissions')
    op.drop_index('idx_submissions_user_created', table_name='submissions')
    op.drop_index('idx_assessment_items_assessment', table_name='assessment_items')
    op.drop_index('idx_assessments_topic', table_name='assessments')
    op.drop_index('idx_assessments_user_created', table_name='assessments')
