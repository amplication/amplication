import * as fs from "fs";
import * as path from "path";
import { createApp } from "../../create-app";
import * as api from "./api.json";

const DESTINATION_DIRECTORY = path.join(__dirname, "..", "dist");

Error.stackTraceLimit = Infinity;

generate().catch((error) => {
  console.error(error);
  process.exit(1);
});

async function generate() {
  await createApp(api, DESTINATION_DIRECTORY);
  /** @todo replace with code generation */
  await copyPrismaSchema();
}

function copyPrismaSchema() {
  console.log("Copied prisma schema");
  return fs.promises.copyFile(
    path.resolve(__dirname, "schema.prisma"),
    path.resolve(DESTINATION_DIRECTORY, "schema.prisma")
  );
}
