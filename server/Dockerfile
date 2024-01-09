FROM python:3.10-alpine
WORKDIR /app
COPY . .
ENV PYTHONUNBUFFERED=1
RUN (test -d static || mkdir static) && pip install --no-cache-dir -r requirements.txt
CMD ["uvicorn", "app.app:app", "--host", "0.0.0.0", "--port", "5001", "--reload", "--log-level", "debug"]
