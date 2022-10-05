import { join, dirname } from "path";
import { mkdir, readFile, writeFile } from "fs/promises";

import { DSGResourceData, Module } from "@amplication/code-gen-types";
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
    const resourceData: DSGResourceData = JSON.parse(file);
    const modules = await createDataServiceImpl(resourceData, defaultLogger);
    await writeModules(modules, destination);
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
