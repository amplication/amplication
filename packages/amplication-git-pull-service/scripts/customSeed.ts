import { PrismaClient } from "@prisma/client";

export async function customSeed() {
  const client = new PrismaClient();
  const owner = "test-organization-name";

  //replace this sample code to populate your database
  //with data that is required for your application to start
  await client.gitRepositoryPull.update({
    where: { owner: owner },
    data: {
      owner,
    },
  });

  client.$disconnect();
}
