import { createModuleFromTemplate, ImportableModule } from "../module.util";

const serviceTemplatePath = require.resolve("./templates/service/service.ts");

export function createServiceModule(
  modulePath: string,
  entityType: string,
  entityDTOModule: string,
  serviceMethods: string[]
): Promise<ImportableModule> {
  return createModuleFromTemplate(
    modulePath,
    serviceTemplatePath,
    {
      ENTITY: entityType,
      ENTITY_DTO_MODULE: entityDTOModule,
      METHODS: serviceMethods.join("\n"),
    },
    [`${entityType}Service`]
  );
}
