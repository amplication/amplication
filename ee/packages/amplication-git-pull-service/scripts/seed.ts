import * as dotenv from "dotenv";
import { PrismaClient } from "@amplication/prisma-clients/amplication-git-pull-service";
import { customSeed } from "./customSeed";
import { EnumGitPullEventStatus } from "../src/contracts/enums/gitPullEventStatus.enum";
import { GitProviderEnum } from "../src/contracts/enums/gitProvider.enum";

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
    status: EnumGitPullEventStatus.Created,
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
