-- CreateTable
CREATE TABLE "public"."Scenario" (
    "id" TEXT NOT NULL,
    "content" JSONB,
    "code" TEXT,
    "section" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "order" INTEGER DEFAULT 0,
    "tags" TEXT[],

    CONSTRAINT "Scenario_pkey" PRIMARY KEY ("id")
);
