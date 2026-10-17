# Local setup

```bash
uv sync
cp .env.example .env
uv run pytest
uv run ruff check .
```

Never commit `.env`, API keys, virtual environments, raw downloads, or
generated logs. Use Supabase for persisted application records; local raw data
is for development only and should remain outside the repository.
