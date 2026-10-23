# Define a function called chunk_text.
#
# text: str
#     The text that we want to split into smaller pieces.
#
# chunk_size: int = 1500
#     The maximum number of characters allowed in each chunk.
#     If the user does not provide a value, 1500 is used.
#
# overlap: int = 200
#     The number of characters that should overlap between
#     consecutive chunks.
#     If the user does not provide a value, 200 is used.
#
# -> list[str]
#     The function returns a list of strings.
#     Each string represents one text chunk.
def chunk_text(
    text: str,
    chunk_size: int = 1500,
    overlap: int = 200
) -> list[str]:

    # Check whether the text is empty or contains only whitespace.
    #
    # text.strip()
    # removes spaces, tabs, and newlines from the beginning
    # and end of the text.
    #
    # If nothing remains, the text is considered empty.
    #
    # Example:
    #     "   " -> ""
    #
    # If the text is empty, return an empty list.
    if not text.strip():
        return []

    # Make sure the overlap is smaller than the chunk size.
    #
    # For example:
    #     chunk_size = 1500
    #     overlap = 200
    #
    # This is valid because 200 < 1500.
    #
    # But:
    #     chunk_size = 1500
    #     overlap = 1500
    #
    # would be invalid because the chunks would not move forward.
    if overlap >= chunk_size:
        raise ValueError("overlap must be smaller than chunk_size")

    # Create an empty list where we will store
    # all of the generated text chunks.
    chunks = []

    # Start reading the text from character position 0.
    #
    # This represents the starting position of our first chunk.
    start = 0

    # Continue creating chunks as long as the starting
    # position is still inside the text.
    while start < len(text):

        # Calculate where the current chunk should end.
        #
        # start + chunk_size
        # gives us the normal ending position.
        #
        # min() makes sure we don't go beyond the end
        # of the text.
        #
        # Example:
        #     text length = 4000
        #     start = 0
        #     chunk_size = 1500
        #
        # end = 1500
        end = min(start + chunk_size, len(text))

        # Extract the text between start and end.
        #
        # .strip()
        # removes unnecessary whitespace from the beginning
        # and end of the chunk.
        chunk = text[start:end].strip()

        # Make sure the chunk is not empty.
        #
        # If the chunk contains actual text,
        # add it to the chunks list.
        if chunk:
            chunks.append(chunk)

        # Move the starting position forward.
        #
        # We don't move by the entire chunk_size because
        # we want some text from the previous chunk
        # to appear again in the next chunk.
        #
        # Example:
        #     chunk_size = 1500
        #     overlap = 200
        #
        # start moves by:
        #
        #     1500 - 200 = 1300
        #
        # So the next chunk starts 1300 characters later,
        # leaving 200 characters of overlap.
        start += chunk_size - overlap

    # Return the complete list of generated chunks.
    return chunks