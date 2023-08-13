-- CreateEnum
CREATE TYPE "EnumSubscriptionPlan" AS ENUM ('Pro', 'Business', 'Enterprise');

-- CreateEnum
CREATE TYPE "EnumSubscriptionStatus" AS ENUM ('Active', 'Trailing', 'PastDue', 'Paused', 'Deleted');

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "subscriptionPlan" "EnumSubscriptionPlan" NOT NULL,
    "status" "EnumSubscriptionStatus" NOT NULL,
    "subscriptionData" JSONB NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Subscription" ADD FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
