-- CreateTable
CREATE TABLE "websiteDailySummary" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "uptimeCount" INTEGER NOT NULL,
    "downtimeCount" INTEGER NOT NULL,
    "uptimePercentage" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "websiteDailySummary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "websiteDailySummary_websiteId_date_key" ON "websiteDailySummary"("websiteId", "date");

-- AddForeignKey
ALTER TABLE "websiteDailySummary" ADD CONSTRAINT "websiteDailySummary_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "website"("id") ON DELETE CASCADE ON UPDATE CASCADE;
