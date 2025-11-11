FROM node:20.18-alpine AS builder

RUN apk add --no-cache libc6-compat python3 make g++ openssl

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npx Prisma generate --schema=apps/backend/Prisma/schema.Prisma && npm run build:backend

FROM node:20-alpine
RUN apk add --no-cache libc6-compat python3 make g++ openssl

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/backend/dist ./dist
COPY --from=builder /app/apps/backend/prisma ./prisma
COPY package.json ./

EXPOSE 3002

CMD ["sh", "-c", "npx prisma migrate reset --force --schema=prisma/schema.prisma && node dist/main.js"]
