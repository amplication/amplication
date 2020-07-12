import { createModuleFromTemplate, ImportableModule } from "../module.util";

const controllerTemplatePath = require.resolve(
  "./templates/controller/controller.ts"
);

export function createControllerModule(
  modulePath: string,
  entityType: string,
  entityDTOModule: string,
  entityServiceModule: string,
  controllerMethods: string[]
): Promise<ImportableModule> {
  return createModuleFromTemplate(
    modulePath,
    controllerTemplatePath,
    {
      ENTITY: entityType,
      ENTITY_DTO_MODULE: entityDTOModule,
      ENTITY_SERVICE_MODULE: entityServiceModule,
      METHODS: controllerMethods.join("\n"),
    },
    [`${entityType}Controller`]
  );
}
