# Use Python 3.12 with the smaller slim image
FROM python:3.12-slim

# Set the working directory inside the container
WORKDIR /app

# Prevent Python from creating .pyc files
ENV PYTHONDONTWRITEBYTECODE=1

# Make Python output appear immediately in Docker logs
ENV PYTHONUNBUFFERED=1

# Copy the dependency file into the container
COPY requirements.txt .

# Install all Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the FastAPI application into the container
COPY app ./app

# Copy the PDF ingestion script into the container
COPY ingest.py .

# Tell Docker that the application uses port 8000
EXPOSE 8000

# Start the FastAPI application
#
# app.main:app means:
# app/main.py -> app = FastAPI(...)
#
# 0.0.0.0 allows the application to be accessed
# from outside the Docker container.
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]