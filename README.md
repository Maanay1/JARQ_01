# JARQ AI Tutor

JARQ is a Next.js + FastAPI AI tutor with voice, personas, memory, lessons, progress tracking and a provider layer ready for OpenAI, Gemini or Ollama.

## Structure

```txt
backend/   FastAPI routes, services, models, Supabase and AI providers
frontend/  Next.js app, Tailwind UI, client services and shared types
docs/      Supabase schema and architecture notes
```

## Setup

Backend:

```bash
cd backend
cp .env.example .env
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Frontend:

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000`.

Useful checks:

```bash
cd backend
PYTHONPYCACHEPREFIX=/private/tmp/jarq_pycache python -m compileall app tests

cd ../frontend
npm run typecheck
```

## How to connect Supabase

1. Create a Supabase project and open **Project Settings → API**.
2. Copy the project URL into:
   - `backend/.env`: `SUPABASE_URL`
   - `frontend/.env.local`: `NEXT_PUBLIC_SUPABASE_URL`
3. Copy the **anon public** key into:
   - `frontend/.env.local`: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `backend/.env`: `SUPABASE_ANON_KEY` (optional fallback for read-only Supabase access)
4. Copy the **service_role** key into:
   - `backend/.env`: `SUPABASE_SERVICE_ROLE_KEY`
5. Open the Supabase SQL editor.
6. Paste the contents of `docs/supabase-schema.sql`.
7. Press **RUN**.
8. Restart both servers after changing env files.

The backend service role key is private and must never be exposed through `NEXT_PUBLIC_*`.

Minimal backend env:

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Minimal frontend env:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

Voice is currently demo-mode by default. Keep `NEXT_PUBLIC_VOICE_DEMO_MODE=true` until real STT/TTS keys are configured in the backend; set it to `false` when the voice adapters are wired to real providers.

## AI Keys

Set only the providers you want to use:

- `AI_PROVIDER=openai | openrouter | gemini | ollama`
- `OPENAI_API_KEY`
- `OPENROUTER_API_KEY`
- `OPENROUTER_MODEL`
- `GEMINI_API_KEY`
- `OLLAMA_BASE_URL`
- `OLLAMA_MODEL`

Default provider is controlled by `AI_PROVIDER`. Ollama can stay configured without running until you switch to it.

## Notes

- API keys must stay in `.env` files.
- Frontend API calls live in `frontend/lib/services/`.
- Shared frontend types live in `frontend/lib/types.ts`.
- The legacy `frontend/lib/api.ts` re-exports services for compatibility.
