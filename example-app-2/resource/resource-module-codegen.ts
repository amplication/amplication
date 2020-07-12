import { ImportableModule, createModuleFromTemplate } from "../module.util";

const moduleTemplatePath = require.resolve("./templates/module.ts");

export function createResourceModule(
  modulePath: string,
  entityType: string,
  entityServiceModule: string,
  entityControllerModule: string
): Promise<ImportableModule> {
  return createModuleFromTemplate(
    modulePath,
    moduleTemplatePath,
    {
      ENTITY: entityType,
      ENTITY_SERVICE_MODULE: entityServiceModule,
      ENTITY_CONTROLLER_MODULE: entityControllerModule,
    },
    [`${entityType}Module`]
  );
}
