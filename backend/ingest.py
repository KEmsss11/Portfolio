from pathlib import Path

from app.rag.ingestion import ingest_pdf


if __name__ == "__main__":
    # Docker Compose mounts the project's documents folder at /app/documents.
    # Resolve the PDF relative to this script, independent of the current cwd.
    pdf_path = (
        Path(__file__).resolve().parent
        / "documents"
        / "INFORMATION OF KEMUEL PAUL.pdf"
    )
    count = ingest_pdf(str(pdf_path))
    print(f"Ingested {count} chunks from {pdf_path.name}.")
