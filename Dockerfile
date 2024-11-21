FROM python:3.10-alpine
WORKDIR /app
COPY server/ .
RUN pip install --no-cache-dir -r requirements.txt
CMD ["gunicorn", "-k",  "uvicorn.workers.UvicornWorker", "--bind", "127.0.0.1:8080", "app:app.app"]
