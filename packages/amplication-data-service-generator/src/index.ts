import { join, dirname } from "path";
import { mkdir, readFile, writeFile } from "fs/promises";

import { createDataService } from "./create-data-service";
import { BuildContext, Module } from "./types";

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
  const file = await readFile(source, "utf8");
  const cgi: BuildContext = JSON.parse(file);
  const modules = await createDataService(
    cgi.data.entities,
    cgi.data.roles,
    cgi.data.serviceInfo
  );
  await writeModules(modules, destination);
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
export * from "./types";
