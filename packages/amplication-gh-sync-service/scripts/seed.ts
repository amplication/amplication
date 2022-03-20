import * as dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { Salt, parseSalt } from "../src/auth/password.service";
import { hash } from "bcrypt";
import { customSeed } from "./customSeed";

if (require.main === module) {
  dotenv.config();

  const { BCRYPT_SALT } = process.env;

  if (!BCRYPT_SALT) {
    throw new Error("BCRYPT_SALT environment variable must be defined");
  }

  const salt = parseSalt(BCRYPT_SALT);

  seed(salt).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

async function seed(bcryptSalt: Salt) {
  console.info("Seeding database...");

  const client = new PrismaClient();
  const data = {
    username: "admin",
    password: await hash("admin", bcryptSalt),
    roles: ["user"],
  };
  await client.user.upsert({
    where: { username: data.username },
    update: {},
    create: data,
  });
  void client.$disconnect();

  console.info("Seeding database with custom seed...");
  customSeed();

  console.info("Seeded database successfully");
}
