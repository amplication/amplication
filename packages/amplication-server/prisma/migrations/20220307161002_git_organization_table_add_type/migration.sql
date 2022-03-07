-- CreateEnum
CREATE TYPE "EnumGitOrganizationType" AS ENUM ('User', 'Organization');

-- AlterTable
ALTER TABLE "GitOrganization" ADD COLUMN     "type" "EnumGitOrganizationType" NOT NULL DEFAULT E'User';
