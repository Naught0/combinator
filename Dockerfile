FROM python:3.10-alpine
WORKDIR /app
COPY server/ .
RUN pip install --no-cache-dir -r requirements.txt
CMD ["gunicorn", "-k",  "uvicorn_worker.UvicornWorker", "--bind", "0.0.0.0:8080", "app.app:app"]
