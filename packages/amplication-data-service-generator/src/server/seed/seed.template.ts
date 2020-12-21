import * as dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
// @ts-ignore
import { Salt, parseSalt } from "../src/auth/password.service";
import { hash } from "bcrypt";

declare const DATA: { username: string };

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
  const data = DATA;
  await client.user.upsert({
    where: { username: data.username },
    update: {},
    create: data,
  });
  client.$disconnect();
  console.info("Seeded database successfully");
}
