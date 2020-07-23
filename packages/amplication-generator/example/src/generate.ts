import * as fs from "fs";
import * as path from "path";
import { generate } from "../../dist";
import api from "./api.json";
import entities from "./entities.json";

const NO_CLEANUP = Boolean(process.env.NO_CLEANUP);
const DESTINATION_DIRECTORY = path.resolve(__dirname, "..", "dist");

generateExample().catch((error) => {
  console.error(error);
  process.exit(1);
});

async function generateExample() {
  if (!NO_CLEANUP) {
    console.info("Cleaning up directory...");
    await fs.promises.rmdir(DESTINATION_DIRECTORY, {
      recursive: true,
    });
  }
  await fs.promises.mkdir(DESTINATION_DIRECTORY, { recursive: true });

  const modules = await generate(entities, api);

  console.info("Writing modules...");
  await Promise.all(
    modules.map(async (module) => {
      const modulePath = path.join(DESTINATION_DIRECTORY, module.path);
      await fs.promises.mkdir(path.dirname(modulePath), { recursive: true });
      await fs.promises.writeFile(modulePath, module.code, "utf-8");
    })
  );
}
