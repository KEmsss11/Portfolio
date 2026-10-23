-- Enable pgvector for semantic search.
CREATE EXTENSION IF NOT EXISTS vector;

-- Store each ingested PDF and its extracted text.
CREATE TABLE IF NOT EXISTS public.pdf_history (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT,
    file_name TEXT NOT NULL,
    extracted_text TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Store page-level text chunks and their 384-dimensional embeddings.
CREATE TABLE IF NOT EXISTS public.pdf_chunk (
    id BIGSERIAL PRIMARY KEY,
    pdf_history_id BIGINT NOT NULL
        REFERENCES public.pdf_history(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    page INTEGER NOT NULL,
    chunk_index INTEGER NOT NULL,
    embedding VECTOR(384) NOT NULL
);

CREATE INDEX IF NOT EXISTS pdf_chunk_history_id_idx
    ON public.pdf_chunk (pdf_history_id);
