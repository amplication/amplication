import * as fs from "fs";
import * as path from "path";
import { createApp } from "../../create-app";
import * as api from "./api.json";

const NO_CLEANUP = Boolean(process.env.NO_CLEANUP);
const DESTINATION_DIRECTORY = path.resolve(__dirname, "..", "dist");

Error.stackTraceLimit = Infinity;

generate().catch((error) => {
  console.error(error);
  process.exit(1);
});

async function generate() {
  if (!NO_CLEANUP) {
    console.info("Cleaning up directory...");
    await fs.promises.rmdir(DESTINATION_DIRECTORY, {
      recursive: true,
    });
  }
  await fs.promises.mkdir(DESTINATION_DIRECTORY, { recursive: true });
  /** @todo replace with code generation */
  await copyPrismaSchema();
  /** @todo enable auto clean */
  await createApp(api, DESTINATION_DIRECTORY, false);
}

function copyPrismaSchema() {
  console.log("Copied prisma schema");
  return fs.promises.copyFile(
    path.resolve(__dirname, "schema.prisma"),
    path.resolve(DESTINATION_DIRECTORY, "schema.prisma")
  );
}
