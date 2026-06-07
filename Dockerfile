# Default image — multi-stage standalone build (~190 MB).
# Override PORT and BASE_API_URL at container runtime (restart to apply).

# Build on the host arch (fast on GHA); runner stage still emits multi-arch images.
FROM --platform=$BUILDPLATFORM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=7000
ENV BASE_API_URL=http://localhost:7001

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 7000

CMD ["node", "server.js"]
