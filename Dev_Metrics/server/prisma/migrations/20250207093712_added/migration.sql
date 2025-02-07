/*
  Warnings:

  - Added the required column `isUp` to the `StatusCheck` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StatusCheck" ADD COLUMN     "isUp" BOOLEAN NOT NULL;
