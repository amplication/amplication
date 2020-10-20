import { PrismaClient } from "@prisma/client";

declare const USER_DATA: {};

if (require.main === module) {
  seed().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

async function seed() {
  const client = new PrismaClient();
  await client.user.create({
    data: USER_DATA,
  });
}
