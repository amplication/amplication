import { join, dirname } from "path";
import { mkdir, readFile, writeFile } from "fs/promises";

import { createDataService } from "./create-data-service";
import { BuildContext, Module } from "@amplication/code-gen-types";
import { createDataServiceImpl } from "./create-data-service-impl";
import { defaultLogger } from "./server/logging";
import axios from "axios";

const buildSpecPath = process.env.BUILD_SPEC_PATH;
const buildOutputPath = process.env.BUILD_OUTPUT_PATH;

if (!buildSpecPath) {
  throw new Error("BUILD_SPEC_PATH is not defined");
}
if (!buildOutputPath) {
  throw new Error("BUILD_OUTPUT_PATH is not defined");
}

generateCode(buildSpecPath, buildOutputPath).catch((err) => {
  console.error(err);
  process.exit(1);
});

export default async function generateCode(
  buildSpecPath: string,
  buildOutputPath: string
): Promise<void> {
  try {
    const file = await readFile(buildSpecPath, "utf8");
    const buildContext: BuildContext = JSON.parse(file);
    const modules = await createDataServiceImpl(
      buildContext.data,
      defaultLogger
    );
    await writeModules(modules, buildOutputPath);
    await axios.put(process.env.STATUS_UPDATE_URL || "", {
      buildId: process.env.BUILD_ID,
      status: "Success",
    });
  } catch (err) {
    console.error(err);
    await axios.put(process.env.STATUS_UPDATE_URL || "", {
      buildId: process.env.BUILD_ID,
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
