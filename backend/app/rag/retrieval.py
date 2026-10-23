# Import create_engine and text from SQLAlchemy.
#
# create_engine() creates the connection to PostgreSQL.
# text() allows us to execute SQL queries.
from sqlalchemy import create_engine, text


# Import environ so we can read environment variables,
# such as DATABASE_URL.
from os import environ


# Import load_dotenv so we can load variables
# from the .env file.
from dotenv import load_dotenv


# Import the function that converts text into
# an embedding vector.
#
# We previously created this function in embeddings.py.
from app.rag.embeddings import create_embedding


# Load the variables stored inside the .env file.
#
# For example:
#
# DATABASE_URL=postgresql://...
#
# After this runs, Python can access DATABASE_URL
# using environ["DATABASE_URL"].
load_dotenv()


# Create a SQLAlchemy database engine.
#
# DATABASE_URL contains the connection information
# for your PostgreSQL database.
#
# pool_pre_ping=True checks whether a database connection
# is still alive before SQLAlchemy uses it.
engine = create_engine(
    environ["DATABASE_URL"],
    pool_pre_ping=True,
)


# Define a function that searches for PDF chunks
# relevant to a user's question.
#
# question:
#     The question asked by the user.
#
# limit:
#     Maximum number of relevant chunks that we want
#     to return.
#
#     Default = 5
#
# max_distance:
#     Maximum allowed vector distance.
#
#     Smaller distance generally means the vectors
#     are more similar.
#
#     Default = 0.65
def retrieve_relevant_chunks(
    question: str,
    limit: int = 5,
    max_distance: float = 0.65,
):

    # Convert the user's question into an embedding.
    #
    # Example:
    #
    # "What is blockchain?"
    #
    # becomes a numerical vector such as:
    #
    # [0.12, -0.34, 0.56, ...]
    #
    # str() converts the vector into a string representation
    # that can be passed to PostgreSQL.
    vector = str(create_embedding(question))


    # Start a database transaction/connection.
    #
    # The connection will automatically be handled
    # by the context manager.
    with engine.begin() as connection:


        # Execute a PostgreSQL query to find PDF chunks
        # that are semantically similar to the question.
        rows = connection.execute(
            text("""
                SELECT
                    c.id,
                    c.pdf_history_id,
                    c.text,
                    c.page,
                    c.chunk_index,

                    -- Calculate the vector distance between
                    -- the stored PDF chunk embedding and
                    -- the question embedding.
                    -- <=> is the pgvector distance operator.
                    c.embedding <=> CAST(:vector AS vector)
                        AS distance,

                    -- Get the original PDF filename.
                    h.file_name

                FROM pdf_chunk c

                -- Connect each chunk to its PDF history record.
                -- This allows us to know which PDF the chunk came from.
                JOIN pdf_history h
                    ON c.pdf_history_id = h.id

                -- Ignore chunks that don't have an embedding.
                WHERE c.embedding IS NOT NULL

                -- Only keep chunks whose vector distance is within the maximum.
                AND c.embedding <=> CAST(:vector AS vector)
                    <= :max_distance

                -- Sort from smallest distance to largest; smaller means more similar.
                ORDER BY c.embedding <=> CAST(:vector AS vector)

                -- Retrieve extra candidates because duplicates are removed later.
                LIMIT 10
            """),
            {
                # Send the question's embedding to PostgreSQL.
                "vector": vector,

                # Send the maximum allowed distance.
                "max_distance": max_distance,
            },
        ).mappings().all()


    # Create an empty list.
    #
    # This will contain the final selected chunks
    # after duplicate chunks have been removed.
    selected = []


    # Go through each candidate returned by PostgreSQL.
    for row in rows:

        # Convert the current chunk's text into a set
        # of lowercase words.
        #
        # lower()
        # makes the comparison case-insensitive.
        #
        # split()
        # separates the text into individual words.
        #
        # set()
        # removes duplicate words.
        words = set(
            row["text"].lower().split()
        )


        # Assume this chunk is not a duplicate.
        duplicate = False


        # Compare the current chunk with every chunk
        # that we have already selected.
        for existing in selected:

            # Convert the already-selected chunk into
            # a set of lowercase words.
            other = set(
                existing["text"].lower().split()
            )


            # Calculate how similar the two chunks are
            # based on their shared words.
            #
            # words & other
            # gives the words that appear in BOTH chunks.
            #
            # words | other
            # gives all unique words appearing in either chunk.
            #
            # This formula is called Jaccard similarity:
            #
            #     intersection / union
            #
            # If the result is >= 0.80,
            # the chunks are considered duplicates.
            if (
                words
                and other
                and len(words & other) / len(words | other) >= 0.80
            ):

                # Mark this chunk as a duplicate.
                duplicate = True

                # No need to compare it with the remaining
                # selected chunks.
                break


        # Only add the chunk if it wasn't considered
        # a duplicate.
        if not duplicate:

            # Convert the SQLAlchemy row into a normal
            # Python dictionary and add it to selected.
            selected.append(dict(row))


        # Stop once we have collected the requested
        # number of chunks.
        #
        # For example:
        #
        # limit = 5
        #
        # Once selected contains 5 chunks,
        # we stop searching.
        if len(selected) >= limit:
            break


    # Return the final list of relevant PDF chunks.
    return selected
