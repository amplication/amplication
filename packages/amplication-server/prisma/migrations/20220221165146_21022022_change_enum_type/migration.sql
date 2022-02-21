/*
  Warnings:

  - Changed the type of `provider` on the `GitOrganization` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "EnumSourceControlService" AS ENUM ('Github');

-- AlterTable
ALTER TABLE "GitOrganization" DROP COLUMN "provider",
ADD COLUMN     "provider" "EnumSourceControlService" NOT NULL;
