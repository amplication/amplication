/*
  Warnings:

  - You are about to drop the column `pacakgeName` on the `BuildPlugin` table. All the data in the column will be lost.
  - You are about to drop the column `pacakgeVersion` on the `BuildPlugin` table. All the data in the column will be lost.
  - Added the required column `packageName` to the `BuildPlugin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `packageVersion` to the `BuildPlugin` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BuildPlugin" DROP COLUMN "pacakgeName",
DROP COLUMN "pacakgeVersion",
ADD COLUMN     "packageName" TEXT NOT NULL,
ADD COLUMN     "packageVersion" TEXT NOT NULL;
