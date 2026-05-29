FROM node:20-alpine AS builder

WORKDIR /app

ARG BASE_API_URL=http://localhost:7001
ENV BASE_API_URL=$BASE_API_URL

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

EXPOSE 7000

CMD ["sh", "-c", "npm run build && npm run start"]
