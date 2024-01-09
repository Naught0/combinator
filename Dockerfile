FROM python:3.10-alpine
WORKDIR /app
COPY server/ .
RUN pip install --no-cache-dir -r requirements.txt
CMD ["uvicorn", "app.app:app", "--host", "0.0.0.0", "--port", "8080"]
