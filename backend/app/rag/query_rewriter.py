# Import Python's regular expression module.
#
# The re module allows us to search for patterns
# inside text.
import re


# Create a list of regular expression patterns.
#
# These patterns are used to detect whether a user's
# question looks like a follow-up question.
#
# For example:
#
#     "Why is it important?"
#     "How does this work?"
#     "What about that?"
#
# These questions can be difficult to understand by
# themselves because words like "it", "this", or "that"
# refer to something mentioned previously.
PATTERNS = [

    # Detect questions that start with:
    #
    # why, how, when, or where
    #
    # and later contain a reference word such as:
    #
    # it, this, that, they, these, those
    #
    # Example:
    #
    # "Why is it important?"
    # "How does this work?"
    r"^(why|how|when|where) .*\b(it|this|that|they|these|those)\b",


    # Detect questions beginning with:
    #
    # what, which, or who
    #
    # followed somewhere by a reference word.
    #
    # Example:
    #
    # "What does this mean?"
    # "Which one is it?"
    r"^(what|which|who) .*\b(it|this|that|they|these|those)\b",


    # Detect questions such as:
    #
    # "What about this?"
    # "How about that?"
    # "Why about..."
    #
    # The pattern specifically looks for:
    #
    # what/how/why + about
    r"^(what|how|why) about\b",


    # Detect short follow-up questions beginning with:
    #
    # and what...
    # but how...
    # so why...
    #
    # Example:
    #
    # "And what about this?"
    # "But how does it work?"
    r"^(and|but|so) (what|how|why)\b",


    # Detect questions such as:
    #
    # "Explain it."
    # "Elaborate on this."
    # "Clarify that."
    # "Expand on it."
    #
    # These clearly refer to something from
    # the previous conversation.
    r"^(explain|elaborate|clarify|expand on) (it|this|that)\b",
]


# Define a function that determines whether a question
# is probably a follow-up question.
#
# question: str
#     The user's current question.
#
# -> bool
#     Returns either True or False.
#
# True  = looks like a follow-up question
# False = looks like a standalone question
def is_follow_up_question(question: str) -> bool:

    # Convert the question to lowercase and remove
    # unnecessary whitespace.
    #
    # Example:
    #
    # "  WHY IS IT IMPORTANT?  "
    #
    # becomes:
    #
    # "why is it important?"
    #
    # lower()
    # converts uppercase letters to lowercase.
    #
    # strip()
    # removes spaces from the beginning and end.
    q = question.lower().strip()


    # Remove punctuation marks from the END of the question.
    #
    # The regular expression:
    #
    # [.!?]+$
    #
    # means:
    #
    # . ! ?
    # one or more times
    # at the end of the string
    #
    # Example:
    #
    # "Why is it important???"
    #
    # becomes:
    #
    # "why is it important"
    q = re.sub(
        r"[.!?]+$",
        "",
        q,
    )


    # Check every pattern in PATTERNS.
    #
    # re.search() looks for the pattern inside q.
    #
    # any() returns True as soon as at least one
    # pattern matches.
    #
    # Therefore:
    #
    # True  -> the question looks like a follow-up
    # False -> none of the patterns matched
    return any(
        re.search(pattern, q)
        for pattern in PATTERNS
    )


# Define a function that rewrites a follow-up question
# using the previous conversation.
#
# question:
#     The user's current question.
#
# messages:
#     A list of previous conversation messages.
#
# -> str
#     Returns a question that includes the previous
#     user question when necessary.
def rewrite_query(
    question: str,
    messages: list[dict],
) -> str:

    # If there are no previous messages,
    # there is nothing to use as context.
    #
    # OR:
    #
    # If the current question is NOT a follow-up,
    # there is no need to rewrite it.
    #
    # In either situation, return the original question.
    if not messages or not is_follow_up_question(question):
        return question


    # Get the content of previous messages where
    # the role is "user".
    #
    # This filters out assistant messages.
    #
    # Example messages:
    #
    # [
    #     {"role": "user", "content": "What is blockchain?"},
    #     {"role": "assistant", "content": "Blockchain is..."},
    #     {"role": "user", "content": "Why is it secure?"}
    # ]
    #
    # The result becomes:
    #
    # [
    #     "What is blockchain?",
    #     "Why is it secure?"
    # ]
    previous = [
        m["content"]
        for m in messages
        if m.get("role") == "user"
    ]


    # If there are no previous user messages,
    # return the original question.
    if not previous:
        return question


    # Combine the most recent previous user question
    # with the current follow-up question.
    #
    # previous[-1]
    # means the LAST item in the previous list.
    #
    # Example:
    #
    # Previous question:
    # "What is blockchain?"
    #
    # Current question:
    # "Why is it secure?"
    #
    # The result becomes:
    #
    # "What is blockchain?
    #  Follow-up question: Why is it secure?"
    #
    # This gives the retrieval system enough context
    # to understand what "it" refers to.
    return (
        f"{previous[-1]}\n"
        f"Follow-up question: {question}"
    )