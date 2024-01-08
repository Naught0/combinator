FROM python:3.9-slim
WORKDIR /app
COPY . .
RUN pip install --no-cache-dir -r requirements.txt
ENV FLASK_ENV=development
ENV FLASK_APP="app.app:app"
CMD ["flask", "run", "-h", "0.0.0.0", "-p", "5001"]
