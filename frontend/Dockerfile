FROM node:18-alpine as deps
WORKDIR /deps
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml\* ./
RUN \
    if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i; \
    else echo "Lockfile not found." && exit 1; \
    fi

FROM node:18-alpine as runner
workdir /frontend
COPY --from=deps /deps/node_modules ./node_modules
COPY . .
CMD ["yarn", "docker:start"]
