-- CreateEnum
CREATE TYPE "EnumGitOrganizationType" AS ENUM ('User', 'Organization');

-- AlterTable
ALTER TABLE "GitOrganization" ADD COLUMN     "type" "EnumGitOrganizationType" DEFAULT E'User';
