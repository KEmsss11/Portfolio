"""Build a project-specific PDF guide using only Python's standard library."""

from __future__ import annotations

import textwrap
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "docs" / "YUMI_RAG_NextJS_PowerShell_Guide_Step_by_Step.pdf"
PAGE_W, PAGE_H = 595, 842  # A4, points
LEFT, RIGHT, TOP, BOTTOM = 46, 46, 54, 48
BODY_W = PAGE_W - LEFT - RIGHT


class PdfGuide:
    def __init__(self) -> None:
        self.pages: list[list[str]] = [[]]
        self.y = PAGE_H - TOP

    def _new_page(self) -> None:
        self.pages.append([])
        self.y = PAGE_H - TOP

    @staticmethod
    def _escape(value: str) -> bytes:
        # Standard PDF fonts use WinAnsiEncoding. Replace unsupported symbols
        # rather than failing on a source file containing an unusual glyph.
        encoded = value.encode("cp1252", errors="replace")
        return encoded.replace(b"\\", b"\\\\").replace(b"(", b"\\(").replace(b")", b"\\)")

    def _line(self, value: str, *, font: str = "F1", size: float = 9,
              color: tuple[float, float, float] = (0.12, 0.16, 0.22),
              indent: float = 0, step: float | None = None) -> None:
        if self.y < BOTTOM + (step or size + 3):
            self._new_page()
        r, g, b = color
        raw = self._escape(value)
        command = (
            f"q {r:.3f} {g:.3f} {b:.3f} rg BT /{font} {size:.1f} Tf "
            f"1 0 0 1 {LEFT + indent:.1f} {self.y:.1f} Tm ".encode("ascii")
            + b"(" + raw + b") Tj ET Q\n"
        )
        self.pages[-1].append(command.decode("latin-1"))
        self.y -= step or size + 3

    def gap(self, amount: float = 5) -> None:
        self.y -= amount

    def heading(self, value: str, level: int = 1) -> None:
        self.gap(7)
        if level == 1:
            self._line(value, font="F2", size=17, color=(0.10, 0.20, 0.38), step=22)
        elif level == 2:
            self._line(value, font="F2", size=12, color=(0.12, 0.30, 0.50), step=16)
        else:
            self._line(value, font="F2", size=10, color=(0.16, 0.24, 0.34), step=13)
        if level == 1:
            self._line("-" * 82, font="F1", size=7, color=(0.30, 0.58, 0.75), step=9)

    def paragraph(self, value: str, *, size: float = 9, indent: float = 0) -> None:
        chars = max(35, int((BODY_W - indent) / (size * 0.49)))
        for line in textwrap.wrap(value, width=chars, break_long_words=True,
                                  break_on_hyphens=False) or [""]:
            self._line(line, size=size, indent=indent, step=size + 4)

    def bullet(self, value: str) -> None:
        self.paragraph("• " + value, indent=5)

    def code(self, source: str) -> None:
        # Keep code indentation and wrap long source lines to fit the page.
        width = 112
        for source_line in source.splitlines() or [""]:
            if not source_line:
                self._line(" ", font="F3", size=6.5, color=(0.16, 0.19, 0.23), step=8)
                continue
            chunks = textwrap.wrap(
                source_line,
                width=width,
                subsequent_indent="    ",
                replace_whitespace=False,
                drop_whitespace=False,
                break_long_words=True,
                break_on_hyphens=False,
            ) or [""]
            for chunk in chunks:
                self._line(chunk, font="F3", size=6.5,
                           color=(0.13, 0.17, 0.22), step=8)

    def build(self) -> bytes:
        # Add a repeating header/footer after page content has been laid out.
        streams: list[bytes] = []
        for page_number, commands in enumerate(self.pages, 1):
            header = (
                f"q 0.82 0.87 0.91 RG 0.5 w {LEFT} {PAGE_H - 37} m "
                f"{PAGE_W - RIGHT} {PAGE_H - 37} l S Q\n"
                f"q 0.25 0.32 0.42 rg BT /F1 7 Tf 1 0 0 1 {LEFT} {PAGE_H - 29} Tm "
                f"(YUMI RAG + Next.js Implementation Guide) Tj ET Q\n"
                f"q 0.82 0.87 0.91 RG 0.5 w {LEFT} 34 m {PAGE_W - RIGHT} 34 l S Q\n"
                f"q 0.25 0.32 0.42 rg BT /F1 7 Tf 1 0 0 1 {LEFT} 22 Tm "
                f"(Portfolio project guide | Page {page_number}) Tj ET Q\n"
            ).encode("ascii")
            streams.append(header + "".join(commands).encode("latin-1"))

        objects: list[bytes] = []
        objects.append(b"<< /Type /Catalog /Pages 2 0 R >>")
        kids = " ".join(f"{6 + i * 2} 0 R" for i in range(len(streams)))
        objects.append(f"<< /Type /Pages /Kids [{kids}] /Count {len(streams)} >>".encode())
        objects.append(
            b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>"
        )
        objects.append(
            b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>"
        )
        objects.append(
            b"<< /Type /Font /Subtype /Type1 /BaseFont /Courier /Encoding /WinAnsiEncoding >>"
        )

        # Font object numbers are 3, 4, and 5; page/content objects start at 6.
        page_object_numbers = [6 + i * 2 for i in range(len(streams))]
        content_object_numbers = [number + 1 for number in page_object_numbers]
        for page_obj, content_obj, stream in zip(page_object_numbers, content_object_numbers, streams):
            objects.append(
                (
                    f"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 {PAGE_W} {PAGE_H}] "
                    f"/Resources << /Font << /F1 3 0 R /F2 4 0 R /F3 5 0 R >> >> "
                    f"/Contents {content_obj} 0 R >>"
                ).encode()
            )
            objects.append(
                f"<< /Length {len(stream)} >>\nstream\n".encode()
                + stream
                + b"\nendstream"
            )

        output = bytearray(b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n")
        offsets = [0]
        for object_number, obj in enumerate(objects, 1):
            offsets.append(len(output))
            output.extend(f"{object_number} 0 obj\n".encode())
            output.extend(obj)
            output.extend(b"\nendobj\n")
        xref_offset = len(output)
        output.extend(f"xref\n0 {len(objects) + 1}\n".encode())
        output.extend(b"0000000000 65535 f \n")
        for offset in offsets[1:]:
            output.extend(f"{offset:010d} 00000 n \n".encode())
        output.extend(
            f"trailer\n<< /Size {len(objects) + 1} /Root 1 0 R >>\n"
            f"startxref\n{xref_offset}\n%%EOF\n".encode()
        )
        return bytes(output)


def main() -> None:
    guide = PdfGuide()
    guide._line("YUMI RAG + Next.js", font="F2", size=25,
                color=(0.08, 0.20, 0.39), step=31)
    guide._line("Implementation, connection, and PowerShell verification guide",
                font="F1", size=12, color=(0.18, 0.34, 0.48), step=20)
    guide.paragraph("This guide follows the current portfolio repository. It documents the PDF ingestion and retrieval flow, the FastAPI and Next.js connection, and practical PowerShell commands to start and inspect the local services.")
    guide.paragraph("Environment files and secret values are intentionally excluded. Replace development credentials with secure values before any public deployment.")

    guide.heading("1. How the RAG system works")
    for item in [
        "Ingestion: PyMuPDF extracts each PDF page, chunk_text splits page text into overlapping sections, Sentence Transformers embeds each section, and PostgreSQL stores text plus vector embeddings.",
        "Retrieval: the Python API embeds the question, searches pgvector by vector distance, and returns the closest relevant chunks with filename and page metadata.",
        "Generation: the RAG pipeline builds a grounded prompt from the question, recent chat history, and retrieved chunks. Ollama generates an answer; the backend attaches citation labels and source records.",
        "Connection: the browser sends the chat request to Next.js /api/chat. That server route forwards it to FastAPI /api/chat. FastAPI calls the RAG pipeline and returns JSON to the browser.",
    ]:
        guide.bullet(item)
    guide.paragraph("Request path: FloatingChat.tsx -> Next.js route.ts -> FastAPI app/api/chat.py -> rag/pipeline.py -> PostgreSQL/pgvector + Ollama.")

    guide.heading("2. Configure and start locally")
    guide.paragraph("Create or update the local Next.js environment file (.env.local) with the Python backend address. Do not paste secret values into this guide.")
    guide.code("PYTHON_API_URL=http://localhost:8000")
    guide.paragraph("When Next.js itself runs inside Docker on the same Compose network, use the backend service name instead: PYTHON_API_URL=http://backend:8000. The current Compose file runs the backend services; start Next.js separately with pnpm dev.")
    guide.heading("Step-by-step: what each part does", level=2)
    steps = [
        ("Step 1 - Database schema", "backend/schema.sql enables pgvector, creates pdf_history to track each source PDF, and creates pdf_chunk to hold page text and 384-number embeddings. Retrieval compares question vectors to these stored vectors."),
        ("Step 2 - Extract and split the PDF", "backend/app/rag/pdf_extractor.py defines PdfPage and PdfResult and uses extract_pdf_text() to read text page by page. backend/app/rag/chunker.py defines chunk_text(); its 1500-character size and 200-character overlap keep related text together across boundaries."),
        ("Step 3 - Embed and ingest", "backend/app/rag/embeddings.py defines get_model(), create_embedding(), and create_embeddings(). The cached SentenceTransformer maps text to normalized vectors. backend/app/rag/ingestion.py defines ingest_pdf(): it removes the prior record with the same filename, extracts each page, chunks it, embeds each chunk, and stores everything in one database transaction. backend/ingest.py selects the mounted portfolio PDF and starts ingestion."),
        ("Step 4 - Retrieve relevant text", "backend/app/rag/retrieval.py defines retrieve_relevant_chunks(). It embeds the question, uses pgvector's cosine-distance operator to rank chunks, applies max_distance, and removes near-duplicate chunks. The filename and page are retained for citations."),
        ("Step 5 - Interpret the question", "backend/app/rag/query_rewriter.py defines is_follow_up_question() and rewrite_query(). These combine a short follow-up with the previous user question. backend/app/rag/pipeline.py then applies portfolio-specific project and technology-stack search hints, handles greetings and thanks directly, and formats project/stack pairs from explicit document headings."),
        ("Step 6 - Build a grounded answer", "backend/app/rag/prompt.py defines build_rag_prompt(). It gives Ollama only the question, recent history, and retrieved PDF text, and asks the model to cite a source. backend/app/rag/llm.py defines generate_text(), which calls Ollama's /api/chat endpoint with the configured model and generation limits."),
        ("Step 7 - Validate and return", "answer_question() in pipeline.py runs the complete retrieval/generation flow, checks for a usable answer, adds a source label if needed, and returns answer plus source records. Deterministic formats are used where the PDF's project-to-stack mapping should not be left to a small model."),
        ("Step 8 - Expose FastAPI endpoints", "backend/app/api/chat.py defines ChatMessage and ChatRequest and the POST /api/chat endpoint. backend/app/main.py creates the FastAPI app, registers the router, enables development CORS, and defines GET /health. backend/Dockerfile and backend/requirements.txt build and install this service."),
        ("Step 9 - Connect Next.js", "src/app/api/chat/route.ts reads PYTHON_API_URL on the server, forwards JSON to FastAPI, and returns JSON errors for bad status, invalid JSON, or connection failures. src/components/FloatingChat.tsx owns the chat UI state; handleSubmit() posts to the same-origin Next.js route, appends user/assistant messages, and shows loading, errors, and sources."),
        ("Step 10 - Run the services", "compose.yaml defines PostgreSQL/pgvector, Ollama, and FastAPI, their Docker DNS names, ports, document mount, and persistent model/data volumes. package.json supplies pnpm dev, pnpm lint, and pnpm build for the Next.js side."),
    ]
    for title, explanation in steps:
        guide.heading(title, level=3)
        guide.paragraph(explanation)
    guide.paragraph("The full source appendix follows these steps in dependency order. Function-level explanations are also included in the files' comments; use the filenames in each heading to open the copyable, unwrapped source in the repository.")
    guide.heading("PowerShell: start services", level=2)
    guide.paragraph("This starts the database, local model server, and Python API in the background. The second command confirms their current state.")
    guide.code("docker compose up -d db ollama backend\ndocker compose ps\ndocker compose exec ollama ollama pull llama3.2:1b\ndocker compose exec ollama ollama list")
    guide.heading("Apply schema and ingest the PDF", level=2)
    guide.paragraph("The first command creates the pgvector extension and tables in the running database. The second extracts and stores the mounted PDF. Re-ingesting the same filename replaces its stored history and chunks.")
    guide.code("Get-Content .\\backend\\schema.sql | docker compose exec -T db psql -U postgres -d yumi\ndocker compose exec backend python ingest.py")
    guide.heading("Run the Next.js app", level=2)
    guide.paragraph("Install the JavaScript packages once, then start the development server. Keep this terminal open while using the portfolio.")
    guide.code("pnpm install\npnpm dev")

    guide.heading("3. PowerShell checks and request examples")
    guide.heading("Check service health and model availability", level=2)
    guide.paragraph("These commands verify the FastAPI health endpoint, Ollama API/model, Docker service status, and number of stored PDF chunks.")
    guide.code("Invoke-RestMethod http://localhost:8000/health\nInvoke-RestMethod http://localhost:11434/api/tags\ndocker compose ps\ndocker compose exec ollama ollama list\ndocker compose exec db psql -U postgres -d yumi -c \"SELECT COUNT(*) AS chunk_count FROM pdf_chunk;\"")
    guide.heading("Send a question directly to FastAPI", level=2)
    guide.paragraph("This creates a JSON request with the question and empty chat history, then calls the Python endpoint directly. A successful response contains answer and sources fields.")
    guide.code('$body = @{ question = "List all projects and their tech stacks"; messages = @() } | ConvertTo-Json -Depth 6\nInvoke-RestMethod -Method Post -Uri http://localhost:8000/api/chat -ContentType "application/json" -Body $body')
    guide.heading("Check the Next.js proxy", level=2)
    guide.paragraph("This checks that the browser-facing Next.js route can forward a request to Python and relay its JSON answer.")
    guide.code('$body = @{ question = "What is EventSphere?"; messages = @() } | ConvertTo-Json -Depth 6\nInvoke-RestMethod -Method Post -Uri http://localhost:3000/api/chat -ContentType "application/json" -Body $body')
    guide.heading("View logs and run available checks", level=2)
    guide.paragraph("Docker logs help locate Python, database, and Ollama errors. pnpm lint checks frontend code style and pnpm build compiles the production frontend.")
    guide.code("docker compose logs --tail=100 backend ollama db\npnpm lint\npnpm build")
    guide.paragraph("The current package.json does not define a test script, and no dedicated test files are present in the repository. pnpm lint and pnpm build are the available frontend checks; the PowerShell HTTP examples exercise the running chat API.")
    guide.heading("Automated PowerShell integration smoke test", level=2)
    guide.paragraph("scripts/Test-YumiRag.ps1 checks FastAPI health, confirms the expected Ollama model is installed, asks the backend for all listed projects and tech stacks, and repeats the question through Next.js. It verifies the three project names, a tech-stack section, and returned PDF sources. It exits with code 1 and prints diagnostics when a check fails.")
    guide.paragraph("Verified in this workspace on 2026-10-23: all 4 checks passed (FastAPI health, installed Ollama model, direct backend RAG response, and Next.js proxy response).")
    guide.paragraph("Start the services and Next.js first, then run:")
    guide.code("powershell -NoProfile -ExecutionPolicy Bypass -File .\\scripts\\Test-YumiRag.ps1")
    guide.paragraph("To point it at different local ports or another model, pass parameters:")
    guide.code(".\\scripts\\Test-YumiRag.ps1 -BackendUrl http://localhost:8000 -NextUrl http://localhost:3000 -OllamaUrl http://localhost:11434 -ModelName llama3.2:1b")
    guide.heading("Common failure clues", level=2)
    for item in [
        "ECONNREFUSED localhost:8000: verify the backend is running and PYTHON_API_URL points to the right host from where Next.js is running.",
        "Information not found: verify the PDF was ingested and the relevant text exists in pdf_chunk; inspect the response and backend logs.",
        "Ollama timeout: confirm the model appears in ollama list and check Ollama logs. The first model load can be slow on CPU.",
        "Invalid JSON from backend: inspect docker compose logs --tail=100 backend; the API route now reports backend errors in Next.js logs.",
    ]:
        guide.bullet(item)

    source_files = [
        "backend/schema.sql",
        "backend/requirements.txt",
        "backend/Dockerfile",
        "compose.yaml",
        "backend/ingest.py",
        "backend/app/main.py",
        "backend/app/api/chat.py",
        "backend/app/rag/pdf_extractor.py",
        "backend/app/rag/chunker.py",
        "backend/app/rag/embeddings.py",
        "backend/app/rag/ingestion.py",
        "backend/app/rag/retrieval.py",
        "backend/app/rag/query_rewriter.py",
        "backend/app/rag/prompt.py",
        "backend/app/rag/llm.py",
        "backend/app/rag/pipeline.py",
        "src/app/api/chat/route.ts",
        "src/components/FloatingChat.tsx",
        "scripts/Test-YumiRag.ps1",
    ]
    guide.heading("4. Current project source code")
    guide.paragraph("The following appendix reproduces the implementation files from this workspace at the time this guide was generated. Long lines are wrapped for page width; use the repository files as the copyable source of truth.")
    for relative_path in source_files:
        path = ROOT / relative_path
        guide.heading(relative_path, level=2)
        if not path.exists():
            guide.paragraph("Source file was not found in this workspace.")
            continue
        guide.code(path.read_text(encoding="utf-8-sig"))
        guide.gap(5)

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_bytes(guide.build())
    print(f"Created {OUTPUT} ({len(guide.pages)} pages, {OUTPUT.stat().st_size:,} bytes)")


if __name__ == "__main__":
    main()
