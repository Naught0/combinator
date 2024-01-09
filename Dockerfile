FROM --platform=amd64 node:18-alpine as deps
WORKDIR /deps
COPY frontend/package.json frontend/pnpm-lock.yaml ./
RUN yarn global add pnpm && pnpm install

FROM --platform=amd64 node:18-alpine as build
WORKDIR /frontend
COPY frontend/ .
COPY --from=deps /deps/node_modules ./node_modules
RUN yarn global add pnpm && pnpm build

FROM python:3.10-alpine
WORKDIR /app
COPY --from=build static ./static
COPY server/ .
RUN pip install --no-cache-dir -r requirements.txt
CMD ["uvicorn", "app.app:app", "--host", "0.0.0.0", "--port", "8080"]
