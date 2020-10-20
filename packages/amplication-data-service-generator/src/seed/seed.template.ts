import * as path from "path";
import * as dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

declare const DATA: { username: string };

if (require.main === module) {
  seed().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

async function seed() {
  console.info("Seeding database...");
  dotenv.config({ path: path.join(__dirname, ".env") });
  const client = new PrismaClient();
  const data = DATA;
  await client.user.upsert({
    where: { username: data.username },
    update: {},
    create: data,
  });
  client.$disconnect();
  console.info("Seeded database successfully");
}
