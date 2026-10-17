from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from supabase import Client

from src.config import settings


def get_supabase_client() -> "Client":
    from supabase import create_client

    return create_client(settings.supabase_url, settings.supabase_key)
