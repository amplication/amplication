import { PrismaClient } from "../prisma/generated-prisma-client";
const crypto = require("crypto");

async function main() {
  const prisma = new PrismaClient();

  for (let index = 0; index < 10; index++) {
    console.log(index++);
    await createChunk(100);
  }

  async function createChunk(count: number) {
    const promises = [...Array(count)].map(() => {
      return prisma.coupon.create({
        data: {
          couponType: "hacktoberfest-2023",
          expiration: new Date("2024-03-31T23:59:59.000Z"),
          durationMonths: 2,
          subscriptionPlan: "Pro",
          code: crypto.randomUUID({ disableEntropyCache: true }),
        },
      });
    });

    await Promise.all(promises);
  }
}

main().catch(console.error);

// Execute from bash
// $ POSTGRESQL_URL=postgresql://admin:admin@localhost:5432/amplication npx ts-node packages/amplication-server/migration-scripts/create-hacktoberfest-coupons.ts
