# Import lru_cache from Python's functools module.
#
# lru_cache allows us to save/cache the result of a function
# so that we don't have to run the same expensive operation
# repeatedly.
from functools import lru_cache


# Import SentenceTransformer.
#
# SentenceTransformer is used to convert text into
# numerical vectors called "embeddings".
#
# These embeddings allow us to compare the meaning
# of different pieces of text.
from sentence_transformers import SentenceTransformer


# Name of the AI embedding model that we want to use.
#
# all-MiniLM-L6-v2 is a relatively small and commonly used
# Sentence Transformer model for generating text embeddings.
#
# The model converts text into a numerical vector.
MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"


# Cache the model so it only needs to be loaded once.
#
# maxsize=1 means we keep a maximum of one result
# in the cache.
#
# Loading an AI model can be expensive and slow,
# so we don't want to load the model every time
# get_model() is called.
@lru_cache(maxsize=1)
def get_model():

    # Load the Sentence Transformer model.
    #
    # MODEL_NAME contains:
    # "sentence-transformers/all-MiniLM-L6-v2"
    #
    # The first time this function runs, the model is loaded.
    #
    # After that, because of @lru_cache, Python can reuse
    # the already-loaded model instead of loading it again.
    return SentenceTransformer(MODEL_NAME)


# Create an embedding for ONE piece of text.
#
# text: str
#     The text we want to convert into an embedding.
#
# -> list[float]
#     The function returns a list of floating-point numbers.
def create_embedding(text: str) -> list[float]:

    # Get the already-loaded Sentence Transformer model.
    #
    # Then use encode() to convert the text into
    # a numerical vector.
    vector = get_model().encode(

        # The actual text that we want to convert.
        text,

        # Normalize the resulting vector.
        #
        # Normalization makes the vector have a length of 1.
        #
        # This is useful when comparing embeddings using
        # similarity methods such as cosine similarity.
        normalize_embeddings=True,
    )

    # Convert the NumPy array returned by encode()
    # into a normal Python list.
    #
    # Example:
    #
    # NumPy array:
    # [0.12, -0.45, 0.78, ...]
    #
    # becomes:
    #
    # [0.12, -0.45, 0.78, ...]
    #
    # but as a normal Python list.
    return vector.tolist()


# Create embeddings for MULTIPLE pieces of text at once.
#
# texts: list[str]
#     A list containing multiple text strings.
#
# Example:
#
# texts = [
#     "What is blockchain?",
#     "What is PostgreSQL?",
#     "What is React?"
# ]
#
# The function generates one embedding for each text.
def create_embeddings(texts: list[str]):

    # Get the cached Sentence Transformer model
    # and encode all the texts at once.
    #
    # Encoding multiple texts together is generally
    # more efficient than calling create_embedding()
    # repeatedly for every piece of text.
    vectors = get_model().encode(

        # The list of text strings to convert into embeddings.
        texts,

        # Normalize every generated embedding.
        normalize_embeddings=True,
    )

    # Convert the returned NumPy array into a normal
    # Python list.
    #
    # Because we supplied multiple texts, this will be
    # a list containing multiple embedding vectors.
    return vectors.tolist()