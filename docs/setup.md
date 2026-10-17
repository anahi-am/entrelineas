# Local setup

```bash
uv sync
cp .env.example .env
uv run pytest
uv run ruff check .
```

Apply [sql/schema.sql](../sql/schema.sql) to the project Supabase database
before enabling persistence. The application writes only reviewed MVP records
through the repository boundary in `db/repositories.py`.

Run the API with:

```bash
uv run uvicorn src.api:app --reload --port 8000
```

Without Supabase credentials, the API serves the reviewed provisional record
from `db/seeds/promises_seed.json`. This is real source data, but it remains
labelled `evidencia_insuficiente` until implementation evidence is reviewed.

Never commit `.env`, API keys, virtual environments, raw downloads, or
generated logs. Use Supabase for persisted application records; local raw data
is for development only and should remain outside the repository.
