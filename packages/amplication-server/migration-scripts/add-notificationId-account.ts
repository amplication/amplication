import { PrismaClient } from "../src/prisma";
import md5 from "crypto-js/md5";
import cuid from "cuid";

async function main() {
  const client = new PrismaClient();
  await client.account.updateMany({
    data: {
      externalId: cuid(),
    },
  });
  await client.$disconnect();
}

main().catch(console.error);
