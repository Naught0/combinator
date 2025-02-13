FROM python:3.12-alpine
WORKDIR /app
COPY server/ .
RUN apk update && apk add --no-cache git && pip install --no-cache-dir -r requirements.txt
CMD ["gunicorn", "-k",  "uvicorn_worker.UvicornWorker", "--bind", "0.0.0.0:8080", "app.app:app"]
