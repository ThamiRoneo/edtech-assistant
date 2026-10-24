# Getting Required Keys

You already have OPENAI_API_KEY. Skip that.

## 1) DATABASE_URL (Postgres)
Options:
- Local Postgres: install Postgres, create DB `edtech` user `edtech` pass `edtech`. URL: `postgresql+psycopg://edtech:edtech@localhost:5432/edtech`
- Supabase: https://supabase.com/ → New Project → Settings > Database → Connection string (URI). Use with psycopg.
- Neon: https://neon.tech/ → Create project → Connection string.

Need pgvector extension. With Docker (infra/docker-compose.yml) we use `pgvector/pgvector:pg16` which has it. For managed DB, enable `vector` extension or use pgvector-enabled instance.

## 2) REDIS_URL
Options:
- Local: `redis://localhost:6379/0` (install redis)
- Upstash Redis: https://upstash.com/ → Redis → Create DB → REST/Redis URL
- Redis Cloud: https://redis.io/cloud

## 3) CLERK_* (Auth)
1. Go to https://dashboard.clerk.com/ → Create application (name: EdTech Assistant)
2. Choose sign-in methods (email/password or social)
3. API Keys: copy `Publishable key` and `Secret key`
   - `CLERK_PUBLISHABLE_KEY=pk_test_...`
   - `CLERK_SECRET_KEY=sk_test_...`
4. JWT Templates / JWKS: Clerk provides JWKS at `https://<your-domain>/.well-known/jwks.json` or use the default. Set `CLERK_JWKS_URL` to your instance's JWKS URL (visible in API keys/advanced or use `https://api.clerk.com/.well-known/jwks.json` if using Clerk's hosted JWKS). For most setups use the JWKS URL from Clerk dashboard (JWT verification).

## Quick .env
Copy infra/.env.example to backend/.env and fill:
```env
DATABASE_URL=postgresql+psycopg://...
REDIS_URL=redis://...
CLERK_SECRET_KEY=sk_test_...
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_JWKS_URL=https://...
OPENAI_API_KEY=sk-...  # you have this
```
