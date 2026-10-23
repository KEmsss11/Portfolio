# Kemuel Paul Nalagon — Portfolio

A Next.js portfolio with **YUMI**, a document-grounded chat assistant. The chat uses a Python/FastAPI RAG backend, Supabase Postgres with pgvector for document chunks and embeddings, and Cloudflare Workers AI for embeddings and hosted text generation.

## Architecture

```text
Browser → Next.js portfolio (Vercel) → FastAPI RAG API (Render)
                                      ├─ Supabase Postgres + pgvector
                                      └─ Cloudflare Workers AI
```

The frontend sends chat requests to `/api/chat`; the Next.js route forwards them to the Python API. PDF ingestion is a separate, token-protected backend endpoint. Ollama was used during local development; the deployed backend uses Cloudflare Workers AI.

## Tech stack

- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS, Framer Motion
- **Backend:** Python, FastAPI
- **RAG:** PDF text extraction with PyMuPDF, chunking, vector embeddings, similarity retrieval, and answer generation
- **Database:** Supabase Postgres with the pgvector extension
- **AI:** Cloudflare Workers AI (`@cf/baai/bge-small-en-v1.5` embeddings and `@cf/zai-org/glm-4.7-flash` generation)
- **Hosting:** Vercel (frontend), Render (backend), Supabase (database)
- **Local AI development:** Ollama

## Run the frontend locally

Requirements: Node.js 18.17 or later and pnpm.

```powershell
pnpm install
```

Create `.env.local` in the repository root:

```dotenv
PYTHON_API_URL=http://localhost:8000
```

Start the frontend:

```powershell
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Run the Python backend locally

The backend needs a Supabase Postgres database and Cloudflare Workers AI credentials. Create `backend/.env` (never commit it):

```dotenv
DATABASE_URL=postgresql+psycopg://postgres.<project-ref>:<YOUR_DATABASE_PASSWORD>@<pooler-host>:5432/postgres
CLOUDFLARE_ACCOUNT_ID=<your-cloudflare-account-id>
CLOUDFLARE_API_TOKEN=<your-cloudflare-api-token>
CLOUDFLARE_AI_MODEL=@cf/zai-org/glm-4.7-flash
INGESTION_TOKEN=<a-long-random-secret>
```

Replace each placeholder with the value from your provider dashboard. Use the Supabase pooler connection string for the database URL and URL-encode special characters in the database password when needed. Keep these values private.

From the repository root, install dependencies and start FastAPI:

```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

In another terminal, run the frontend with `pnpm dev`. The API health endpoint is [http://localhost:8000/health](http://localhost:8000/health); interactive API documentation is at [http://localhost:8000/docs](http://localhost:8000/docs).

## Configure Supabase

Run [`backend/schema.sql`](backend/schema.sql) once in the Supabase SQL Editor. It enables pgvector and creates `pdf_history` and `pdf_chunk`. Keep Row Level Security enabled and do not expose the database password or service credentials in browser code.

## Ingest or replace the portfolio PDF

The backend accepts PDF uploads at `POST /api/ingest`. It requires the `X-Ingestion-Token` header and accepts PDFs up to 20 MB. After replacing the PDF, upload it again so the backend stores fresh chunks and embeddings.

From the repository root in PowerShell:

```powershell
$ingestionToken = Read-Host "Paste your ingestion token"
curl.exe -X POST "http://localhost:8000/api/ingest" `
  -H "X-Ingestion-Token: $ingestionToken" `
  -F "file=@documents/INFORMATION OF KEMUEL PAUL.pdf;type=application/pdf"
```

For the deployed backend, replace `http://localhost:8000` with its Render URL. A successful response includes the PDF filename and `chunks_ingested` count.

## Deploy

### FastAPI backend on Render

Create a Python Web Service connected to this repository and configure:

- **Root Directory:** `backend`
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Environment variables:** `DATABASE_URL`, `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_AI_MODEL`, and `INGESTION_TOKEN`

After deployment, visit `https://<your-render-service>/health`; it should return `{"status":"ok"}`.

### Next.js frontend on Vercel

Import the repository into Vercel with the repository root as the project root. Add this server-side environment variable, using the Render service URL without a trailing slash:

```dotenv
PYTHON_API_URL=https://<your-render-service>.onrender.com
```

Redeploy after changing environment variables. The browser calls the Next.js `/api/chat` route, which forwards requests to the FastAPI backend.

## Troubleshooting

- **Chat says it cannot reach the backend:** check `PYTHON_API_URL`, the Render service status, and `GET /health`.
- **Chat returns a backend error:** inspect the Render service logs for the matching `POST /api/chat` traceback. The frontend does not expose provider secrets or raw backend errors.
- **Ingestion returns 401:** make sure the `X-Ingestion-Token` value exactly matches Render's `INGESTION_TOKEN`.
- **Answers do not reflect the updated PDF:** upload the replacement PDF again and confirm `chunks_ingested` is greater than zero.
- **Cloudflare generation or embedding fails:** confirm the Cloudflare account ID and API token are set in Render and that the token has Workers AI permissions.

## Security notes

- Do not commit `.env`, `.env.local`, API tokens, database URLs, or ingestion tokens.
- Keep Cloudflare and database credentials on the backend. Do not prefix them with `NEXT_PUBLIC_`.
- Rotate any secret that has been shared publicly or accidentally committed.
