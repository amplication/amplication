/*
  Warnings:

  - The values [Business] on the enum `EnumSubscriptionPlan` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EnumSubscriptionPlan_new" AS ENUM ('Free', 'Pro', 'Enterprise');
ALTER TABLE "Subscription" ALTER COLUMN "subscriptionPlan" TYPE "EnumSubscriptionPlan_new" USING ("subscriptionPlan"::text::"EnumSubscriptionPlan_new");
ALTER TYPE "EnumSubscriptionPlan" RENAME TO "EnumSubscriptionPlan_old";
ALTER TYPE "EnumSubscriptionPlan_new" RENAME TO "EnumSubscriptionPlan";
DROP TYPE "EnumSubscriptionPlan_old";
COMMIT;
