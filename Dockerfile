FROM node:16.13-alpine as build
WORKDIR /frontend
COPY frontend/package.json package.json
COPY frontend/tsconfig.json tsconfig.json
COPY frontend/src ./src
COPY frontend/public ./public
RUN yarn install
RUN yarn build

FROM python:3.9-slim
WORKDIR /app
COPY --from=build static ./static
COPY server/requirements.txt .
COPY server ./server
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install gunicorn==20.1.0
RUN pip install eventlet==0.30.2
ENV FLASK_ENV production
ARG PORT=8080
ENV PORT=${PORT}
CMD gunicorn --worker-class eventlet -w 1 --threads 8 --timeout 0 -b 0.0.0.0:${PORT} app:app
