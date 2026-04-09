-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('ON_DRAFT', 'ON_WROK', 'ON_PUBLISHED', 'ON_VIDEO_EDITING', 'ON_VIDEO_SCRIPT');

-- AlterTable
ALTER TABLE "public"."Scenario" ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "status" "public"."Status" NOT NULL DEFAULT 'ON_DRAFT';
