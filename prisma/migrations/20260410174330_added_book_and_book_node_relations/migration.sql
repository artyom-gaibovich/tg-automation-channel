-- CreateEnum
CREATE TYPE "NodeTypeEnum" AS ENUM ('PART', 'CHAPTER', 'SECRION');

-- CreateTable
CREATE TABLE "books" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "books_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookNode" (
    "id" SERIAL NOT NULL,
    "bookId" INTEGER NOT NULL,
    "parentId" INTEGER,
    "nodeType" "NodeTypeEnum" NOT NULL,
    "numberPart" VARCHAR(20),
    "title" TEXT NOT NULL,
    "content" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookNode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BookNode_bookId_idx" ON "BookNode"("bookId");

-- CreateIndex
CREATE INDEX "BookNode_parentId_idx" ON "BookNode"("parentId");

-- CreateIndex
CREATE INDEX "BookNode_level_idx" ON "BookNode"("level");

-- CreateIndex
CREATE INDEX "BookNode_bookId_parentId_idx" ON "BookNode"("bookId", "parentId");

-- CreateIndex
CREATE UNIQUE INDEX "BookNode_bookId_sortOrder_key" ON "BookNode"("bookId", "sortOrder");

-- AddForeignKey
ALTER TABLE "BookNode" ADD CONSTRAINT "BookNode_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookNode" ADD CONSTRAINT "BookNode_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "BookNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;
