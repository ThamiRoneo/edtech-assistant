# EdTech Assistant

Math K-12 assistant for individual learners: submission grading (text+image via LLM vision), mastery tracking, gap reports, practice assessments, and Socratic tutor.

## Quick start (local)

### Backend (FastAPI)
```bash
cd backend
cp ../infra/.env.example .env  # edit with keys
pip install -r requirements.txt  # or use system deps
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

## Env vars
See infra/.env.example. Required: DATABASE_URL, REDIS_URL, CLERK_*, OPENAI_API_KEY.
