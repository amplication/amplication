import * as fs from "fs";
import * as path from "path";
import { OpenAPIObject } from "openapi3-ts";

import { PrismaClient } from "@prisma/client";

import { writeModules } from "./module.util";
import { copyDirectory } from "./fs.utils";
import { createSchemaModules } from "./open-api-types-codegen";
import { createResourcesModules } from "./open-api-nest-codegen";
import { createAppModule } from "./nest-app-module-codegen";

const OUTPUT_DIRECTORY = "dist";

const indexTemplatePath = require.resolve("./templates/index.ts");

export async function codegen(api: OpenAPIObject, client: PrismaClient) {
  const resourcesModules = await createResourcesModules(api, client);
  const schemaModules = createSchemaModules(api);
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
