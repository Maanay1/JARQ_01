from app.db.supabase import get_supabase_client

_IN_MEMORY_LEARNER_MEMORIES: dict[str, list[str]] = {}


class MemoryRepository:
    """Stores and retrieves durable learner memories.

    Expected Supabase table:
    learner_memories(id uuid, user_id text, content text, importance int, created_at timestamptz)
    """

    def __init__(self) -> None:
        self.client = get_supabase_client()

    async def list_recent(self, user_id: str, limit: int = 5) -> list[str]:
        if self.client is None:
            return _IN_MEMORY_LEARNER_MEMORIES.get(user_id, [])[:limit]

        try:
            response = (
                self.client.table("learner_memories")
                .select("content")
                .eq("user_id", user_id)
                .order("created_at", desc=True)
                .limit(limit)
                .execute()
            )
            return [row["content"] for row in response.data or []]
        except Exception:
            return _IN_MEMORY_LEARNER_MEMORIES.get(user_id, [])[:limit]

    async def add(self, user_id: str, content: str, importance: int = 1) -> None:
        clean_content = content.strip()
        if not clean_content:
            return
        if self.client is None:
            _IN_MEMORY_LEARNER_MEMORIES.setdefault(user_id, []).insert(0, clean_content)
            return

        try:
            self.client.table("learner_memories").insert(
                {"user_id": user_id, "content": clean_content, "importance": importance}
            ).execute()
        except Exception:
            _IN_MEMORY_LEARNER_MEMORIES.setdefault(user_id, []).insert(0, clean_content)
