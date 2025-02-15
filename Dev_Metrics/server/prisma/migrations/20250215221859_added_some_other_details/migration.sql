-- AlterTable
ALTER TABLE "website" ADD COLUMN     "alert_when" TEXT NOT NULL DEFAULT 'URL becomes unavailable',
ADD COLUMN     "contact_mode" TEXT NOT NULL DEFAULT 'E-mail';
