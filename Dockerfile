FROM --platform=amd64 node:18-alpine as deps
WORKDIR /deps
COPY frontend/package.json frontend/pnpm-lock.yaml ./
RUN yarn global add pnpm && pnpm install

FROM --platform=amd64 node:18-alpine as build
WORKDIR /frontend
COPY frontend/ .
COPY --from=deps /deps/node_modules ./node_modules
RUN yarn global add pnpm && pnpm build

FROM python:3.9-slim
WORKDIR /app
COPY --from=build static ./app/static
COPY server/ .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install gunicorn==20.1.0
RUN pip install eventlet==0.30.2
ENV FLASK_ENV production
ARG PORT=8080
ENV PORT=${PORT}
CMD gunicorn --worker-class eventlet -w 1 --threads 8 --timeout 0 -b 0.0.0.0:${PORT} app.app:app
