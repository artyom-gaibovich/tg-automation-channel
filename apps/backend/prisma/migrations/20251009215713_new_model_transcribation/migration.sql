-- CreateTable
CREATE TABLE "public"."Transcribation" (
    "id" TEXT NOT NULL,
    "fileName" TEXT,
    "content" TEXT,
    "code" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transcribation_pkey" PRIMARY KEY ("id")
);
