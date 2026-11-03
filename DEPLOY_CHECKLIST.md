# Deploy Checklist

## Pre-deploy
- [ ] Rotate all secrets (Clerk, OpenAI, S3) - old keys in infra/.env.bak
- [ ] Create infra/.env.prod from infra/.env.prod.example with real values
- [ ] Set CORS_ORIGINS to production frontend URL
- [ ] Configure TRUSTED_PROXIES for LB/proxy
- [ ] Use managed Postgres (pgvector) + managed Redis with TLS/auth
- [ ] Set DATABASE_URL with sslmode=require
- [ ] Enable RATE_LIMIT_FAIL_CLOSED=true in prod

## Build/Deploy
- [ ] Run migrations: `alembic upgrade head` (or migrate service)
- [ ] Deploy backend (gunicorn) with health checks
- [ ] Deploy Celery worker separately
- [ ] Deploy frontend to Vercel or container (standalone)
- [ ] Configure TLS (Caddy/platform LB)
- [ ] Set up reverse proxy to backend

## Post-deploy
- [ ] Verify /health, /livez, /readyz
- [ ] Verify /metrics accessible (if scraped)
- [ ] Test auth, rate limiting, file uploads
- [ ] Monitor logs/metrics/errors
- [ ] Configure backups/PITR for DB
