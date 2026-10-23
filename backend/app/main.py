from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import the chatbot router from app/api/chat.py.
#
# "router as chat_router" gives the imported router
# a clearer name in this file.
from app.api.chat import router as chat_router


# ---------------------------------------------------------
# CREATE THE FASTAPI APPLICATION
# ---------------------------------------------------------

# Create the main FastAPI application.
#
# The title appears in the automatic FastAPI documentation
# at:
#
# http://localhost:8000/docs
app = FastAPI(
    title="YUMI RAG API"
)


# ---------------------------------------------------------
# CORS CONFIGURATION
# ---------------------------------------------------------

# CORS allows your frontend and backend to communicate
# when they are running on different ports.
#
# Your setup is:
#
# Frontend:
# http://localhost:3000
#
# Backend:
# http://localhost:8000
#
# Because these are different origins, the backend needs
# to allow the frontend through CORS.
app.add_middleware(
    CORSMiddleware,

    # Only allow requests from your Next.js/React
    # development server.
    allow_origins=[
        "http://localhost:3000"
    ],

    # Allow cookies/authentication credentials
    # to be sent with requests.
    allow_credentials=True,

    # Allow all HTTP methods.
    #
    # Examples:
    # GET
    # POST
    # PUT
    # DELETE
    allow_methods=["*"],

    # Allow all request headers.
    allow_headers=["*"],
)


# ---------------------------------------------------------
# HEALTH CHECK
# ---------------------------------------------------------

# Create a simple endpoint that lets us check whether
# the FastAPI server is running.
@app.get("/health")
def health():

    # Return a simple JSON response.
    return {
        "status": "ok"
    }


# ---------------------------------------------------------
# REGISTER THE CHAT ROUTER
# ---------------------------------------------------------

# Add all routes from chat_router to the application.
#
# The prefix "/api" is added before the routes
# defined inside chat.py.
#
# chat.py contains:
#
# @router.post("/chat")
#
# Therefore the final endpoint becomes:
#
# POST /api/chat
app.include_router(
    chat_router,
    prefix="/api",
)