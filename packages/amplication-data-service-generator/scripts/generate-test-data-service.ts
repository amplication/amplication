import * as path from "path";
import * as fs from "fs";
import { createDataService, EntityWithFields, Module } from "..";
import entities from "../src/tests/entities.json";

export default async function generateTestDataService(
  destination: string
): Promise<void> {
  const modules = await createDataService(entities as EntityWithFields[]);
  await writeModules(modules, destination);
}

async function writeModules(
  modules: Module[],
  destination: string
): Promise<void> {
  console.info(`Writing modules to ${destination}${path.sep} ...`);
  await Promise.all(
    modules.map(async (module) => {
      const filePath = path.join(destination, module.path);
      await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
      await fs.promises.writeFile(filePath, module.code);
    })
  );
  console.info(`Successfully wrote modules to ${destination}${path.sep}`);
}
