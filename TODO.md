# EdTech Assistant - Implementation Checklist

Plan: .local/share/kilo/plans/1792846542043-edtech-assistant-stack.md

## Infra & Setup
- [x] Project structure (frontend/backend/infra/docs)
- [x] README
- [x] Docker Compose (Postgres pgvector, Redis, FastAPI, Celery) with healthchecks
- [x] Backend Dockerfile
- [x] Environment example (.env.example)
- [x] Alembic setup + initial migration with pgvector extension
- [x] Git initialized, main clean, dev branch

## Core Backend
- [x] FastAPI app entrypoint + health
- [x] Config
- [x] DB session
- [x] Clerk auth middleware (JWKS)
- [x] Models: User, Topic, Submission, Rubric, Mark, Mastery, Assessment, AssessmentItem, KnowledgeChunk
- [x] Migrations (Alembic)

## APIs (v1)
- [x] Submissions (create/list/get) - enqueue grading job
- [x] Mastery (get) + Gaps (threshold)
- [x] Assessments (generate with adaptive difficulty)
- [x] Tutor (SSE chat with session store)
- [x] Knowledge (ingest + search stubs)

## Grading & Mastery
- [x] Celery app + worker
- [x] Grading task skeleton with retries
- [x] Transactional mastery update (EMA) on grading success
- [x] Mark storage
- [x] Real LLM vision grading with rubric + structured JSON
- [x] Deterministic rubric scoring path
- [x] Few-shot + consistency checks
- [x] Golden-set benchmark (n=50) structure

## RAG
- [x] PDF/text ingestion (pypdf/langchain-text-splitters)
- [x] Retrieval service (pgvector)
- [x] Embeddings path scaffolded
- [x] Curriculum seeding

## Assessments
- [x] Adaptive difficulty by mastery
- [x] Template question bank
- [x] LLM distractor generation (partial)
- [ ] Scoring/feedback

## Tutor
- [x] Redis session state
- [x] Socratic prompt scaffolding + hints ladder (stub)
- [x] Context from mastery/recent errors

## Storage/Auth/Infra
- [x] S3-compatible upload (presigned)
- [x] Clerk webhook/user sync hardening (middleware + keys)
- [x] CORS/env validation
- [ ] Production hardening (PII, retention)

## Frontend (Next.js)
- [x] Next.js + TypeScript + Tailwind + shadcn/ui scaffold
- [x] Clerk auth integration
- [x] Submit work (text+image) UI
- [x] Grading status/polling
- [x] Mastery dashboard + gap report
- [x] Practice assessment UI
- [x] Tutor chat (SSE)
- [ ] KaTeX for math

## Testing/QA
- [x] Basic unit tests (scoring, mastery, grading service, ingestion)
- [x] API tests
- [x] Integration tests (grading flow)
- [ ] Load test grading endpoint

## Status Summary
- Implemented: ~75% (scaffold + core models/APIs/tasks/migrations + LLM grading + uploads + RAG + frontend + auth)
- Remaining: polish (deterministic rubric path, few-shot, embeddings production, question bank, distractors, KaTeX, tests)

## Recent Updates
- [x] Clerk auth integrated (keys configured, middleware added)
- [x] Postgres + pgvector installed locally
- [x] Redis installed locally
- [x] Backend running on :8000, frontend on :3000
- [x] Test user created via Clerk
