FROM python:3.10-slim

# Install system dependencies for AMUSE, galpy, mpi4py
RUN apt-get update && apt-get install -y \
    build-essential \
    gfortran \
    libopenmpi-dev \
    openmpi-bin \
    libfftw3-dev \
    libgsl-dev \
    libgmp-dev \
    wget \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

COPY backend/ ./backend/

EXPOSE 8000

CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
