import { join, dirname } from "path";
import { mkdir, readFile, writeFile } from "fs/promises";

import { createDataService } from "./create-data-service";
import { BuildContext, Module } from "@amplication/code-gen-types";
import { createDataServiceImpl } from "./create-data-service-impl";
import { defaultLogger } from "./server/logging";
import axios from "axios";

const [, , source, destination] = process.argv;
if (!source) {
  throw new Error("SOURCE is not defined");
}
if (!destination) {
  throw new Error("DESTINATION is not defined");
}

generateCode(source, destination).catch((err) => {
  console.error(err);
  process.exit(1);
});

export default async function generateCode(
  source: string,
  destination: string
): Promise<void> {
  try {
    const file = await readFile(source, "utf8");
    const buildContext: BuildContext = JSON.parse(file);
    const modules = await createDataServiceImpl(buildContext.data, defaultLogger);
    await writeModules(modules, destination);
    await axios.post(process.env.STATUS_UPDATE_URL || "", {
      actionStepId: process.env.ACTION_STEP_ID,
      status: "Success",
    });
  } catch (err) {
    console.error(err);
    await axios.post(process.env.STATUS_UPDATE_URL || "", {
      actionStepId: process.env.ACTION_STEP_ID,
      status: "Failed",
    });
  }
}

async function writeModules(
  modules: Module[],
  destination: string
): Promise<void> {
  console.info(`Writing modules to ${destination} ...`);
  await Promise.all(
    modules.map(async (module) => {
      const filePath = join(destination, module.path);
      await mkdir(dirname(filePath), { recursive: true });
      await writeFile(filePath, module.code);
    })
  );
  console.info(`Successfully wrote modules to ${destination}`);
}

export { createDataService };
export * from "@amplication/code-gen-types";
