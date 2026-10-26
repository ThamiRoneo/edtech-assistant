# Frontend UI/UX Plan (Backend-Compatible)

## Backend API Mapping
- Auth: Clerk (middleware exists) - need sign-in/up pages
- Submissions: POST/GET /api/v1/submissions/ (create, list, get) - upload text+images
- Mastery: GET /api/v1/mastery/, GET /api/v1/mastery/gaps
- Assessments: POST /api/v1/assessments/generate, GET/POST items
- Tutor: POST /api/v1/tutor/chat (SSE)
- Knowledge: POST /api/v1/knowledge/ingest, GET /api/v1/knowledge/search
- Uploads: POST /api/v1/uploads/presigned

## Pages/Routes
1. Landing (/) - Hero, features, CTA to sign up
2. Auth (/sign-in, /sign-up) - Clerk components
3. Dashboard (/dashboard) - Overview of mastery, recent submissions, gaps
4. Submit (/submit) - Text + image upload with presigned URLs, status polling
5. Mastery (/mastery) - Progress by topic, gaps list
6. Assessments (/assess) - Generate practice, take quiz, results
7. Tutor (/tutor) - Chat interface with SSE streaming
8. Knowledge (/knowledge) - Upload PDFs/notes for RAG

## Design System (from UI/UX Pro Max)
- Style: AI-Native UI
- Colors: Primary #7C3AED, Accent #0891B2, Background #FAF5FF
- Typography: Inter
- Components: Cards, buttons, forms, tables, chat bubbles

## User Flow
1. Landing → Sign up (Clerk) → Dashboard
2. Submit work → Grading job → Status update → Feedback
3. View gaps → Generate assessment → Practice → Update mastery
4. Ask tutor → SSE response with context

## Implementation Plan
- Setup: layout with ClerkProvider, nav, Tailwind
- API client with auth headers
- Components: Card, Button, Input, etc.
- Pages as above
- Polling for submission status
- SSE for tutor
