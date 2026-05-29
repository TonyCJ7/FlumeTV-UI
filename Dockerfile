# Default (fast) image — multi-stage standalone build (~190 MB).
# BASE_API_URL is fixed at http://localhost:7001. Override PORT at runtime only.
# For restart-time env overrides, build Dockerfile.configurable instead.

FROM node:20-alpine AS builder

WORKDIR /app

ENV BASE_API_URL=http://localhost:7001

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
