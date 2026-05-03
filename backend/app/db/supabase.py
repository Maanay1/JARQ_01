from __future__ import annotations

from functools import lru_cache

from supabase import Client, create_client

from app.core.config import settings


@lru_cache
def get_supabase_client() -> Client | None:
    supabase_key = settings.supabase_service_role_key or settings.supabase_anon_key
    if not settings.supabase_url or not supabase_key:
        return None

    return create_client(settings.supabase_url, supabase_key)
