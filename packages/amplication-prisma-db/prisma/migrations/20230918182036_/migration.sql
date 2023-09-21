-- CreateTable
CREATE TABLE "Coupon" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "newUserId" TEXT,
    "code" TEXT NOT NULL,
    "expiration" TIMESTAMP(3) NOT NULL,
    "subscriptionPlan" "EnumSubscriptionPlan" NOT NULL DEFAULT 'Pro',
    "durationMonths" INTEGER NOT NULL DEFAULT 1,
    "redemptionAt" TIMESTAMP(3),

    CONSTRAINT "Coupon_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Coupon_newUserId_key" ON "Coupon"("newUserId");

-- AddForeignKey
ALTER TABLE "Coupon" ADD CONSTRAINT "Coupon_newUserId_fkey" FOREIGN KEY ("newUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
