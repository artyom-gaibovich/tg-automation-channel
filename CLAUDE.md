# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run start:dev       # Watch mode (hot reload)
npm run start:debug     # Debug + watch mode

# Build
npm run build           # Compile TypeScript to dist/

# Linting & Formatting
npm run lint            # ESLint with auto-fix
npm run format          # Prettier format

# Testing
npm run test            # Run all unit tests
npm run test:watch      # Watch mode
npm run test:cov        # Coverage report
npm run test:e2e        # End-to-end tests (requires ./test/jest-e2e.json)
# Run a single test file:
npx jest src/modules/auth/auth.service.spec.ts

# Database
npx prisma migrate dev  # Apply migrations (dev)
npx prisma migrate reset # Reset and re-apply all migrations
npx prisma generate     # Regenerate Prisma client
npx prisma studio       # GUI for database

# Docker
docker-compose up -d    # Start app + PostgreSQL
```

## Environment Variables

Required in `.env`:
- `DATABASE_URL` — PostgreSQL connection string
- `JWT_ACCESS_SECRET` — JWT signing secret
- `API_ID`, `API_HASH`, `API_SESSION` — Telegram client credentials (MTProto)
- `YOUTUBE_API_KEY` — YouTube Data API v3 key

App runs on port **3002**. PostgreSQL runs on **5432** (credentials: admin/admin).

## Architecture

NestJS monolith with feature modules under `src/modules/`. Two distinct architectural styles coexist:

### Simple CRUD modules
`auth`, `category`, `user`, `user-channel`, `message`, `telegram-client` — standard NestJS: Controller → Service → PrismaService.

### Clean Architecture modules
`transcription` and `scenario` follow a strict layered approach:

```
presentation/     ← Controllers, API contracts (DTOs), formatters
application/      ← Use cases (one class per operation), abstract repository interfaces
infrastructure/   ← Prisma repository implementations
domain/           ← Entities (plain classes, no framework deps)
```

New modules in these areas should follow the same layered pattern. Use cases receive a repository via constructor injection (abstract type), concrete implementation is provided in the module's providers array.

### Shared module (`src/modules/shared/`)
- `PrismaService` — database client, imported via `SharedModule.forDatabase()`
- `EmojiLogger` — custom logger (`src/modules/shared/logger/emojii.logger.ts`)
- `HttpExceptionFilter` — global error formatter

## Key Conventions

- **API contracts** live in `presentation/controllers/api-contracts/` within each module — these are the validated request/response DTOs used by controllers, separate from domain entities.
- **Formatters** in the presentation layer transform use case outputs to HTTP response shape.
- **Repository abstractions** are defined in `application/repositories/` as abstract classes; Prisma implementations live in `infrastructure/`.
- Tests use `ts-jest`; test files match `*.spec.ts` and must live inside `src/`.
- The `nestjs` dependency (`"nestjs": "file:../../../../config"`) points to a local config path — ensure this path exists on the machine.

## Database Schema Notes

- `StatusEnum` on `Scenario` model contains a typo: `ON_WROK` (not `ON_WORK`) — match this exactly when referencing status values.
- `Transcribation` model name is intentionally spelled this way in the schema.
- Prisma config is in `prisma.config.ts` (not the default location); schema is at `prisma/schema.prisma`.
