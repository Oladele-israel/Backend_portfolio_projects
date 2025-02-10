-- AlterTable
ALTER TABLE "statusCheck" ADD COLUMN     "contentEncoding" TEXT,
ADD COLUMN     "contentSize" INTEGER,
ADD COLUMN     "dnsTime" DOUBLE PRECISION,
ADD COLUMN     "errorStack" TEXT,
ADD COLUMN     "errorType" TEXT,
ADD COLUMN     "finalUrl" TEXT,
ADD COLUMN     "geoLocation" TEXT,
ADD COLUMN     "headers" TEXT,
ADD COLUMN     "redirectCount" INTEGER,
ADD COLUMN     "sslInfo" TEXT;
