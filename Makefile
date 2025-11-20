
migrate:
	npx prisma migrate dev --schema=./apps/backend/prisma/schema.prisma


generate-types:
	npx prisma generate --schema=./apps/backend/prisma/schema.prisma



