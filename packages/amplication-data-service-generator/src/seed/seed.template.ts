import * as dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

declare const DATA: {};

if (require.main === module) {
  seed().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

async function seed() {
  dotenv.config();
  const client = new PrismaClient();
  await client.user.create({
    data: DATA,
  });
}
