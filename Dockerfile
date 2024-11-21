FROM python:3.10-alpine
WORKDIR /app
COPY server/ .
RUN pip install --no-cache-dir -r requirements.txt
CMD ["uvicorn", "app.app:app", "--port", "8080"]
