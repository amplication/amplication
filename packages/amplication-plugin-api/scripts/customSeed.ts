import { PrismaClient } from "../prisma/generated-prisma-client";

export async function customSeed() {
  const client = new PrismaClient();

  client.$disconnect();
}
