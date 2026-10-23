# Import Path from pathlib.
#
# Path makes it easier and safer to work with file paths
# across different operating systems.
from pathlib import Path


# Import create_engine and text from SQLAlchemy.
#
# create_engine() creates a connection to the database.
#
# text() allows us to write raw SQL queries that can
# be executed through SQLAlchemy.
from sqlalchemy import create_engine, text


# Import environ from os.
#
# environ allows us to access environment variables,
# such as DATABASE_URL.
from os import environ


# Import load_dotenv.
#
# This loads variables from a .env file into the
# application's environment.
from dotenv import load_dotenv


# Import our PDF extraction function.
#
# This function was created earlier and is responsible
# for extracting text from the PDF.
from app.rag.pdf_extractor import extract_pdf_text


# Import our text chunking function.
#
# This function takes large text and divides it
# into smaller chunks.
from app.rag.chunker import chunk_text


# Import our embedding function.
#
# This converts each text chunk into a numerical vector
# that can be used for semantic/vector searching.
from app.rag.embeddings import create_embedding


# Load the variables from the .env file.
#
# For example, your .env file may contain:
#
# DATABASE_URL=postgresql://user:password@host/database
#
# After load_dotenv(), Python can access DATABASE_URL
# through environ["DATABASE_URL"].
load_dotenv()


# Create a SQLAlchemy database engine.
#
# environ["DATABASE_URL"]
# gets the database connection URL from the environment.
#
# pool_pre_ping=True
# tells SQLAlchemy to check whether a database connection
# is still alive before using it.
#
# This helps prevent errors caused by stale database
# connections.
engine = create_engine(
    environ["DATABASE_URL"],
    pool_pre_ping=True,
)


# Define the function that handles the complete PDF ingestion process.
#
# file_path:
#     The location of the PDF file on the computer/server.
#
# file_name:
#     Optional name of the PDF.
#     None means the user does not have to provide it.
#
# user_id:
#     Optional ID of the user who uploaded the PDF.
#
# -> int
#     The function returns an integer representing
#     the total number of chunks inserted into the database.
def ingest_pdf(
    file_path: str,
    file_name: str | None = None,
    user_id: str | None = None,
) -> int:

    # Convert the file path string into a Path object.
    #
    # Path gives us useful methods such as:
    #     path.exists()
    #     path.name
    #
    # Example:
    #
    # "uploads/document.pdf"
    #
    # becomes a Path object representing that location.
    path = Path(file_path)


    # Check whether the PDF file actually exists.
    #
    # If the file does not exist, stop the function
    # and raise an error.
    if not path.exists():
        raise FileNotFoundError(path)


    # If file_name was provided, use it.
    #
    # If file_name is None or empty, use the actual
    # filename from the Path object.
    #
    # Example:
    #
    # file_path = "/uploads/my_document.pdf"
    #
    # path.name = "my_document.pdf"
    file_name = file_name or path.name


    # Extract all text from the PDF.
    #
    # extract_pdf_text() returns a PdfResult containing:
    #
    #     result.text
    #         -> all PDF text
    #
    #     result.pages
    #         -> number of pages
    #
    #     result.page_texts
    #         -> individual page information
    result = extract_pdf_text(str(path))


    # Start a database transaction.
    #
    # engine.begin() automatically:
    #
    #     commits if everything succeeds
    #
    #     rolls back if an error occurs
    #
    # "connection" is the active database connection
    # used for our SQL queries.
    with engine.begin() as connection:


        # Delete an existing PDF history record
        # with the same filename.
        #
        # This prevents multiple old versions of the same
        # filename from remaining in pdf_history.
        #
        # :file_name is a parameter placeholder.
        # The actual value is safely provided separately
        # in the dictionary below.
        connection.execute(
            text("""
                DELETE FROM pdf_history
                WHERE file_name = :file_name
            """),
            {
                "file_name": file_name,
            },
        )


        # Insert a new record into the pdf_history table.
        #
        # pdf_history stores information about the uploaded
        # and extracted PDF.
        #
        # The RETURNING id part asks PostgreSQL to give us
        # the ID of the newly inserted record.
        history_id = connection.execute(
            text("""
                INSERT INTO pdf_history (
                    user_id,
                    file_name,
                    extracted_text
                )
                VALUES (
                    :user_id,
                    :file_name,
                    :extracted_text
                )
                RETURNING id
            """),
            {
                # The ID of the user who uploaded the PDF.
                "user_id": user_id,

                # The name of the PDF file.
                "file_name": file_name,

                # The complete extracted text from the PDF.
                "extracted_text": result.text,
            },
        ).scalar_one()


        # Keep track of how many chunks we successfully
        # insert into the database.
        #
        # It starts at zero.
        total = 0


        # Loop through every page extracted from the PDF.
        #
        # result.page_texts contains PdfPage objects.
        #
        # Each page contains:
        #
        #     page.page
        #     page.text
        for page in result.page_texts:


            # Split the current page's text into smaller chunks.
            #
            # chunk_text() returns something like:
            #
            # [
            #     "First 1500 characters...",
            #     "Next chunk...",
            #     "Next chunk..."
            # ]
            for index, chunk in enumerate(
                chunk_text(page.text)
            ):


                # Convert the current text chunk into
                # a numerical embedding vector.
                #
                # Example:
                #
                # "Blockchain is..."
                #
                # becomes something conceptually like:
                #
                # [0.12, -0.45, 0.78, ...]
                vector = create_embedding(chunk)


                # Insert the current chunk and its embedding
                # into the pdf_chunk table.
                #
                # CAST(:embedding AS vector)
                # tells PostgreSQL to treat the embedding
                # as a pgvector vector type.
                connection.execute(
                    text("""
                        INSERT INTO pdf_chunk (
                            pdf_history_id,
                            text,
                            page,
                            chunk_index,
                            embedding
                        )
                        VALUES (
                            :history_id,
                            :text,
                            :page,
                            :chunk_index,
                            CAST(:embedding AS vector)
                        )
                    """),
                    {
                        # ID of the PDF history record we created
                        # earlier.
                        "history_id": history_id,

                        # The actual text of this chunk.
                        "text": chunk,

                        # The page number where this chunk came from.
                        "page": page.page,

                        # The chunk's position within that page.
                        #
                        # enumerate() starts at 0:
                        #
                        # 0 = first chunk
                        # 1 = second chunk
                        # 2 = third chunk
                        "chunk_index": index,

                        # Convert the Python embedding list into
                        # a string representation that PostgreSQL
                        # pgvector can cast into a vector.
                        "embedding": str(vector),
                    },
                )


                # Increase the total chunk counter by one
                # after successfully inserting the chunk.
                total += 1


    # Return the total number of chunks inserted.
    #
    # Example:
    #
    # If the PDF produced 25 chunks:
    #
    #     return 25
    return total