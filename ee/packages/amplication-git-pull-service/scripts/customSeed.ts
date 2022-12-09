import { PrismaClient } from "../prisma/generated-prisma-client";

export async function customSeed() {
  const client = new PrismaClient();
  const repositoryOwner = "test-organization-name";
  const id = 123;

  //replace this sample code to populate your databases
  //with data that is required for your application to start
  await client.gitPullEvent.update({
    where: { id: id },
    data: {
      repositoryOwner,
    },
  });

  client.$disconnect();
}
