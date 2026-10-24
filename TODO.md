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
- [x] Config (pydantic-settings)
- [x] DB session
- [x] Clerk auth middleware (JWKS)
- [x] Models: User, Topic, Submission, Rubric, Mark, Mastery, Assessment, AssessmentItem, KnowledgeChunk
- [x] Migrations (Alembic)

## APIs (v1)
- [x] Submissions (create/list/get) - enqueue grading job
- [x] Mastery (get) + Gaps (threshold)
- [x] Assessments (generate stub)
- [x] Tutor (SSE chat stub)
- [x] Knowledge (ingest stub)

## Grading & Mastery
- [x] Celery app + worker
- [x] Grading task skeleton with retries
- [x] Transactional mastery update (EMA) on grading success
- [x] Mark storage
- [ ] Real LLM vision grading with rubric + structured JSON
- [ ] Deterministic rubric scoring path
- [ ] Few-shot + consistency checks
- [ ] Golden-set benchmark (n=50)

## RAG
- [ ] PDF/text ingestion (pypdf/langchain-text-splitters)
- [ ] Embeddings (OpenAI) to pgvector
- [ ] Retrieval for tutor/context
- [ ] Curriculum seeding

## Assessments
- [ ] Template question bank
- [ ] LLM distractor generation
- [ ] Adaptive difficulty by mastery
- [ ] Scoring/feedback

## Tutor
- [ ] Redis session state
- [ ] Socratic prompt scaffolding + hints ladder
- [ ] Context from mastery/recent errors

## Storage/Auth/Infra
- [ ] S3-compatible upload (presigned)
- [ ] Clerk webhook/user sync hardening
- [ ] CORS/env validation
- [ ] Production hardening (PII, retention)

## Frontend (Next.js)
- [ ] Next.js + TypeScript + Tailwind + shadcn/ui
- [ ] Clerk auth integration
- [ ] Submit work (text+image) UI
- [ ] Grading status/polling
- [ ] Mastery dashboard + gap report
- [ ] Practice assessment UI
- [ ] Tutor chat (SSE)
- [ ] KaTeX for math

## Testing/QA
- [x] Basic unit tests (scoring, mastery)
- [ ] API tests
- [ ] Integration tests (grading flow)
- [ ] Load test grading endpoint

## Status Summary
- Implemented: ~40% (scaffold + core models/APIs/tasks/migrations)
- Remaining: LLM integration, RAG ingestion/retrieval, full assessment/tutor logic, frontend, uploads, tests
