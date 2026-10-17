# EntreLineas frontend

React/Vite frontend for the Spain-wide housing MVP.

```bash
npm install
cp .env.example .env.local
npm run dev
```

With `VITE_API_BASE_URL` set, the app reads published, human-reviewed records
from the FastAPI backend. Without it, the app uses clearly labelled demo data.
