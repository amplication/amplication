import * as path from "path";
import * as fs from "fs";
import entities from "../src/tests/entities";
import roles from "../src/tests/roles";
import { appInfo } from "../src/tests/appInfo";
import { AppInfo, Module } from "../src/types";
import { createDataService } from "../src/create-data-service";

if (require.main === module) {
  const [, , output] = process.argv;
  if (!output) {
    throw new Error("OUTPUT is not defined");
  }
  generateTestDataService(output, appInfo).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

export default async function generateTestDataService(
  destination: string,
  appInfo: AppInfo
): Promise<void> {
  const modules = await createDataService(entities, roles, appInfo);
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
