# JARQ Architecture

JARQ is structured as a small monorepo:

- `frontend/`: Next.js tutor interface.
- `backend/`: FastAPI API and AI orchestration.
- `docs/`: setup notes and database schema.

## Backend Flow

1. `POST /api/v1/tutor/chat` receives a learner profile, message, persona and provider.
2. `TutorOrchestrator` loads recent learner memory from Supabase.
3. `prompts.py` builds a persona-aware teaching prompt.
4. `AIProvider` sends the prompt to OpenAI, Gemini or Ollama.
5. The response returns with provider metadata and memory used.

## AI Provider Layer

All providers implement `AIProvider.complete(messages)`.

Current providers:

- `OpenAIProvider`
- `GeminiProvider`
- `OllamaProvider`

This keeps the product logic independent from vendor APIs. When a new model is needed, add a provider and register it in `backend/app/services/ai/factory.py`.

## Memory

Memory is intentionally conservative in this first version. The backend stores a memory only when the learner writes a message containing `remember:`.

Later steps:

- Add a memory extraction classifier.
- Store skill progress, mistakes and preferred examples separately.
- Add embeddings for semantic memory search.
- Add privacy controls for deleting or exporting memory.

## Voice

The frontend has a mic action placeholder. The recommended next backend shape is:

- `POST /api/v1/voice/transcribe`
- `POST /api/v1/voice/speak`

Keep voice separate from tutor chat so text, speech and future realtime sessions can share the same tutor orchestration.
