# EdTech Assistant

AI-powered math tutoring for K-12 students. Submit work for rubric-grounded grading, track per-topic mastery with gap reports, take adaptive practice assessments, and learn with a Socratic tutor.

## Features

- **Submission grading** — Text and image uploads graded against curriculum rubrics with LLM vision
- **Mastery tracking** — Per-topic EMA mastery scores that update after each graded submission
- **Gap reports** — Focus areas surfaced automatically based on mastery thresholds
- **Adaptive practice** — Assessments tailored to the student's current mastery level
- **Socratic tutor** — Conversational tutoring that guides through problems without giving answers away
- **Curriculum-aligned** — Knowledge graph drives grading, assessments, and tutoring

## Tech Stack

- **Frontend**: Next.js 16, TypeScript, Tailwind CSS v4, Clerk auth
- **Backend**: FastAPI, SQLAlchemy, Alembic, Postgres with pgvector
- **Workers**: Celery, Redis
- **AI/ML**: OpenAI for grading and tutoring, pgvector for retrieval

## Quick start (local)

### Backend (FastAPI)
```bash
cd backend
cp ../infra/.env.example .env  # edit with keys
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

### Worker (Celery)
```bash
cd backend
celery -A app.tasks worker --loglevel=info
```

### Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev  # http://localhost:3000
```

### Docker (full stack)
```bash
cd infra
docker compose up --build
```

## Environment variables

See `infra/.env.example`. Required: `DATABASE_URL`, `REDIS_URL`, `CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `CLERK_JWKS_URL`, `OPENAI_API_KEY`.
