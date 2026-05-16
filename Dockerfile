# ===============================
# STAGE 1: BUILDER
# ===============================
FROM node:20-slim AS builder

WORKDIR /app

# Copy dependency dulu (biar cache kepakai)
COPY package*.json ./

# Install dependency (lebih cepat & stabil)
RUN npm ci

# Copy source code
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

# (Optional: kalau butuh template, biarkan. kalau tidak, hapus)
COPY --from=builder /app/apps/service-pelanggaran/src/templates ./apps/service-pelanggaran/src/templates

# Env
ARG APP_NAME
ENV APP_TARGET=${APP_NAME}

# Run app
CMD ["sh", "-c", "node dist/apps/${APP_TARGET}/main.js"]