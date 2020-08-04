import * as path from "path";
import * as fs from "fs";
import { createDataService, Entity, Module } from "..";
import entities from "../src/tests/entities.json";

export default async function generateTestDataService(destination: string) {
  const modules = await createDataService(entities as Entity[]);
  writeModules(modules, destination);
}

async function writeModules(modules: Module[], destination: string) {
  await Promise.all(
    modules.map(async (module) => {
      const filePath = path.join(destination, module.path);
      await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
      await fs.promises.writeFile(filePath, module.code);
    })
  );
}
