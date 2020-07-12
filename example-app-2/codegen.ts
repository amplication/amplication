import * as fs from "fs";
import * as path from "path";
import { OpenAPIObject } from "openapi3-ts";

import { PrismaClient } from "@prisma/client";
import flatten = require("lodash.flatten");

import { writeModules } from "./module.util";
import { copyDirectory } from "./fs.utils";
import { getSchemaToDelegate } from "./open-api-primsa";
import { schemaToModule } from "./open-api-types-codegen";
import { generateResource } from "./open-api-nest-codegen";
import { groupByResource } from "./open-api.util";
import { createAppModule } from "./nest-app-module-codegen";

const OUTPUT_DIRECTORY = "dist";

const indexTemplatePath = require.resolve("./templates/index.ts");

export async function codegen(api: OpenAPIObject, client: PrismaClient) {
  const byResource = groupByResource(api);
  const schemaToDelegate = getSchemaToDelegate(api, client);
  const resourceModuleLists = await Promise.all(
    Object.entries(byResource).map(([resource, paths]) =>
      generateResource(api, resource, paths, schemaToDelegate)
    )
  );
  const resourceModules = flatten(resourceModuleLists);
  if (!api?.components?.schemas) {
    throw new Error("api.components.schemas must be defined");
  }
  const schemaModules = Object.entries(
    api.components.schemas
  ).map(([name, schema]) => schemaToModule(schema, name));
  const appModule = await createAppModule(resourceModules);

  const modules = [...resourceModules, ...schemaModules, appModule];

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
