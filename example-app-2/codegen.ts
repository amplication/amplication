import * as fs from "fs";
import * as path from "path";
import { OpenAPIObject } from "openapi3-ts";

import { writeModules } from "./util/module";
import { copyDirectory } from "./util/fs";
import { createDTOModules } from "./dto-codegen";
import { createResourcesModules } from "./resource/resource-codegen";
import { createAppModule } from "./app-module-codegen";

const OUTPUT_DIRECTORY = "dist";

const indexTemplatePath = require.resolve("./templates/index.ts");

export async function codegen(api: OpenAPIObject) {
  const resourcesModules = await createResourcesModules(api);
  const schemaModules = createDTOModules(api);
  const appModule = await createAppModule(resourcesModules);

  const modules = [...resourcesModules, ...schemaModules, appModule];

  await writeModules(modules, OUTPUT_DIRECTORY);

  await copyDirectory(
    path.join("templates", "prisma"),
    path.join(OUTPUT_DIRECTORY, "prisma")
  );

  await fs.promises.copyFile(
    indexTemplatePath,
    path.join(OUTPUT_DIRECTORY, "index.ts")
  );
}
