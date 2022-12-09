import * as dotenv from "dotenv";
import { PrismaClient } from "../prisma/generated-prisma-client";
import { customSeed } from "./customSeed";
import {
  GitProviderEnum,
  GitPullEventStatusEnum,
} from "../src/git-pull-event/git-pull-event.types";

if (require.main === module) {
  dotenv.config();

  seed().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

async function seed() {
  console.info("Seeding database...");

  const client = new PrismaClient();
  const data = {
    id: 123,
    provider: GitProviderEnum.Github,
    repositoryOwner: "Jon Doe",
    repositoryName: "test-organization-name",
    branch: "main",
    commit: "e3355tt",
    pushedAt: new Date(),
    status: GitPullEventStatusEnum.Created,
  };
  await client.gitPullEvent.upsert({
    where: { id: data.id },
    update: {},
    create: data,
  });
  void client.$disconnect();

  console.info("Seeding database with custom seed...");
  customSeed();

  console.info("Seeded database successfully");
}
