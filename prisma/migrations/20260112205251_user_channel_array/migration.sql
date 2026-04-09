/*
  Warnings:

  - The `channelsToRewrite` column on the `UserChannel` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."UserChannel" DROP COLUMN "channelsToRewrite",
ADD COLUMN     "channelsToRewrite" TEXT[];
