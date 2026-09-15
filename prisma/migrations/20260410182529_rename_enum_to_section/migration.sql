/*
  Warnings:

  - The values [SECRION] on the enum `NodeTypeEnum` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "NodeTypeEnum_new" AS ENUM ('PART', 'CHAPTER', 'SECTION');
ALTER TABLE "BookNode" ALTER COLUMN "nodeType" TYPE "NodeTypeEnum_new" USING ("nodeType"::text::"NodeTypeEnum_new");
ALTER TYPE "NodeTypeEnum" RENAME TO "NodeTypeEnum_old";
ALTER TYPE "NodeTypeEnum_new" RENAME TO "NodeTypeEnum";
DROP TYPE "public"."NodeTypeEnum_old";
COMMIT;
