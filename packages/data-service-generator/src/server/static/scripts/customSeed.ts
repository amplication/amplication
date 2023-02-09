import { PrismaClient } from "@prisma/client";

export async function customSeed() {
  const client = new PrismaClient();

  client.$disconnect();
}
