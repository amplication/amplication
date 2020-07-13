import path from "path";
import {
  Module,
  createModuleFromTemplate,
  relativeImportPath,
} from "../module.util";

const moduleTemplatePath = require.resolve("./templates/module.ts");

export function createResourceModule(
  modulePath: string,
  entityType: string,
  entityServiceModule: string,
  entityControllerModule: string
): Promise<Module> {
  return createModuleFromTemplate(modulePath, moduleTemplatePath, {
    ENTITY: entityType,
    ENTITY_SERVICE_MODULE: relativeImportPath(modulePath, entityServiceModule),
    ENTITY_CONTROLLER_MODULE: relativeImportPath(
      modulePath,
      entityControllerModule
    ),
  });
}
