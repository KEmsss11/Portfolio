import os
import secrets
import shutil
import tempfile
from pathlib import Path

from fastapi import APIRouter, File, Header, HTTPException, UploadFile

from app.rag.ingestion import ingest_pdf

router = APIRouter()

MAX_UPLOAD_BYTES = 20 * 1024 * 1024


@router.post("/ingest")
def upload_pdf(
    file: UploadFile = File(...),
    x_ingestion_token: str | None = Header(default=None),
):
    expected_token = os.getenv("INGESTION_TOKEN")

    if not expected_token:
        raise HTTPException(
            status_code=503,
            detail="PDF ingestion is not configured.",
        )

    if not x_ingestion_token or not secrets.compare_digest(
        x_ingestion_token,
        expected_token,
    ):
        raise HTTPException(status_code=401, detail="Invalid ingestion token.")

    if not file.filename or Path(file.filename).suffix.lower() != ".pdf":
        raise HTTPException(status_code=400, detail="Upload a PDF file.")

    file.file.seek(0, os.SEEK_END)
    file_size = file.file.tell()
    file.file.seek(0)

    if file_size > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="PDF must be under 20 MB.")

    temp_path = None

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
            shutil.copyfileobj(file.file, temp_file)
            temp_path = temp_file.name

        chunk_count = ingest_pdf(
            temp_path,
            file_name=Path(file.filename).name,
        )

        return {
            "file_name": Path(file.filename).name,
            "chunks_ingested": chunk_count,
        }
    finally:
        file.file.close()
        if temp_path:
            Path(temp_path).unlink(missing_ok=True)