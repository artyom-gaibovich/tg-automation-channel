-- CreateTable
CREATE TABLE "book_node_transcriptions" (
    "id" TEXT NOT NULL,
    "bookNodeId" INTEGER NOT NULL,
    "transcribationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "book_node_transcriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "book_node_transcriptions_bookNodeId_idx" ON "book_node_transcriptions"("bookNodeId");

-- CreateIndex
CREATE INDEX "book_node_transcriptions_transcribationId_idx" ON "book_node_transcriptions"("transcribationId");

-- CreateIndex
CREATE UNIQUE INDEX "book_node_transcriptions_bookNodeId_transcribationId_key" ON "book_node_transcriptions"("bookNodeId", "transcribationId");

-- AddForeignKey
ALTER TABLE "book_node_transcriptions" ADD CONSTRAINT "book_node_transcriptions_bookNodeId_fkey" FOREIGN KEY ("bookNodeId") REFERENCES "BookNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "book_node_transcriptions" ADD CONSTRAINT "book_node_transcriptions_transcribationId_fkey" FOREIGN KEY ("transcribationId") REFERENCES "Transcribation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
