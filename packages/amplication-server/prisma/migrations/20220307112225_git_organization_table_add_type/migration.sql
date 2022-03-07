/*
  Warnings:

  - Added the required column `type` to the `GitOrganization` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EnumGitOrganizationType" AS ENUM ('User', 'Organization');

-- AlterTable
ALTER TABLE "GitOrganization" ADD COLUMN     "type" "EnumGitOrganizationType" NOT NULL;
