import { PrismaClient } from "@prisma/client";

export async function customSeed() {
  const client = new PrismaClient();
  const username = "admin";

  //replace this sample code to populate your database
  //with data that is required for your application to start
  await client.user.update({
    where: { username: username },
    data: {
      username,
    },
  });

  client.$disconnect();
}
