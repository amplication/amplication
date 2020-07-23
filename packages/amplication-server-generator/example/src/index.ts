import * as fs from "fs";
import * as path from "path";
import { createApp } from "../..";
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
  await copyPrismaSchema();

  const modules = await createApp(api);

  console.info("Writing modules...");
  await Promise.all(
    modules.map(async (module) => {
      const modulePath = path.join(DESTINATION_DIRECTORY, module.path);
      await fs.promises.mkdir(path.dirname(modulePath), { recursive: true });
      await fs.promises.writeFile(modulePath, module.code, "utf-8");
    })
  );
}

function copyPrismaSchema() {
  console.info("Copied prisma schema");
  return fs.promises.copyFile(
    path.resolve(__dirname, "schema.prisma"),
    path.resolve(DESTINATION_DIRECTORY, "schema.prisma")
  );
}
