import {
  createModuleFromTemplate,
  Module,
  relativeImportPath,
} from "../module.util";

const controllerTemplatePath = require.resolve(
  "./templates/controller/controller.ts"
);

export function createControllerModule(
  modulePath: string,
  entityType: string,
  entityDTOModule: string,
  entityServiceModule: string,
  controllerMethods: string[]
): Promise<Module> {
  return createModuleFromTemplate(modulePath, controllerTemplatePath, {
    ENTITY: entityType,
    ENTITY_DTO_MODULE: relativeImportPath(modulePath, entityDTOModule),
    ENTITY_SERVICE_MODULE: relativeImportPath(modulePath, entityServiceModule),
    METHODS: controllerMethods.join("\n"),
  });
}
