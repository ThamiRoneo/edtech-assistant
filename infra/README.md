# Deployment

## Managed infra (recommended)
- DB: Managed Postgres with pgvector (Neon/Supabase/RDS). Set DATABASE_URL with sslmode=require.
- Redis: Managed Redis (Upstash/ElastiCache). Set REDIS_URL with TLS/auth.
- Frontend: Vercel (set NEXT_PUBLIC_API_URL to backend). No frontend service in compose.
- Secrets: Use platform secret manager/CI secrets. Never commit .env.prod.
- TLS: Use platform LB or Caddy (see Caddyfile).

## Steps
1. Copy infra/.env.prod.example to infra/.env.prod and fill values.
2. Run migrations: `alembic upgrade head` (or via migrate service).
3. Deploy backend/celery via container platform; frontend to Vercel.
4. Configure CORS_ORIGINS to frontend domain, TRUSTED_PROXIES for LB.
5. Verify /health, /livez, /readyz, /metrics.
