import { createModuleFromTemplate, Module } from "../module.util";

const serviceTemplatePath = require.resolve("./templates/service/service.ts");

export function createServiceModule(
  modulePath: string,
  entityType: string,
  entityDTOModule: string,
  serviceMethods: string[]
): Promise<Module> {
  return createModuleFromTemplate(modulePath, serviceTemplatePath, {
    ENTITY: entityType,
    ENTITY_DTO_MODULE: entityDTOModule,
    METHODS: serviceMethods.join("\n"),
  });
}
