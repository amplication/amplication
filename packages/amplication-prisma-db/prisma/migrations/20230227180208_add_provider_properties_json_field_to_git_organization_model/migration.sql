/*
  Warnings:

  - Added the required column `providerProperties` to the `GitOrganization` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GitOrganization" ADD COLUMN     "providerProperties" JSONB NOT NULL;
