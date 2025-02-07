/*
  Warnings:

  - You are about to drop the `Check` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `Website` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Check" DROP CONSTRAINT "Check_websiteId_fkey";

-- AlterTable
ALTER TABLE "Website" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "Check";

-- CreateTable
CREATE TABLE "StatusCheck" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "statusCode" INTEGER NOT NULL,
    "responseTime" DOUBLE PRECISION NOT NULL,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "checkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StatusCheck_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StatusCheck" ADD CONSTRAINT "StatusCheck_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;
