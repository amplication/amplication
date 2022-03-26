import * as dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { customSeed } from "./customSeed";

if (require.main === module) {
  dotenv.config();

  // seed().catch((error) => {
  //   console.error(error);
  //   process.exit(1);
  // });
}

// async function seed() {
//   console.info("Seeding databases...");
//
//   const client = new PrismaClient();
//   const data = {
//     id: 1,
//     branch: "main",
//     owner: "test-organization-name",
//     provider: "GitHub",
//   };
//   await client.gitPullEvent.upsert({
//     where: { id: data.id },
//     update: {},
//     create: data,
//   });
//   void client.$disconnect();
//
//   console.info("Seeding databases with custom seed...");
//   customSeed();
//
//   console.info("Seeded databases successfully");
// }
