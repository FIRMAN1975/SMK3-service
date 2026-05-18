# ===============================
# STAGE 1: BUILDER
# ===============================
FROM node:20-slim AS builder

WORKDIR /app

# Copy dependency dulu (biar cache kepakai)
COPY package*.json ./

# Install dependency dengan timeout & retry agar tidak ECONNRESET
RUN npm config set fetch-retry-maxtimeout 120000 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retries 5 && \
    npm install --prefer-offline --no-audit --no-fund

# Copy seluruh source monorepo
COPY . .

# Build app sesuai argumen
ARG APP_NAME
RUN npm run build ${APP_NAME}

# ===============================
# STAGE 2: RUNNER
# ===============================
FROM node:20-slim

WORKDIR /app

# Copy hasil build + dependency
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Copy templates hanya untuk service-pelanggaran
RUN mkdir -p ./apps/service-pelanggaran/src
COPY --from=builder /app/apps/service-pelanggaran/src/templates \
     ./apps/service-pelanggaran/src/templates

# Env
ARG APP_NAME
ENV APP_TARGET=${APP_NAME}

# Buat folder uploads untuk service yang butuh file storage
RUN mkdir -p /app/uploads

# Run app
CMD ["sh", "-c", "node dist/apps/${APP_TARGET}/main.js"]
