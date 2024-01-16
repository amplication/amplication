import { EnumDataType } from "../../prisma";
import { PromptManagerGeneratePromptForBreakTheMonolithArgs } from "./prompt-manager.types";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PromptManagerService {
  generatePromptForBreakTheMonolith(
    resource: PromptManagerGeneratePromptForBreakTheMonolithArgs
  ): string {
    const entityIdNameMap = resource.entities.reduce((acc, entity) => {
      acc[entity.id] = entity.name;
      return acc;
    });

    const resourceDetails = {
      resourceName: resource.name,
      resourceDisplayName: resource.name,
      entities: resource.entities.map((entity) => {
        return {
          name: entity.name,
          displayName: entity.displayName,
          fields: entity.versions[0].fields.map((field) => {
            return {
              name: field.name,
              displayName: field.displayName,
              dataType:
                field.dataType == EnumDataType.Lookup
                  ? entityIdNameMap[field.properties["relatedEntityId"]]
                  : field.dataType,
              relatedDataModel:
                field.dataType == EnumDataType.Lookup
                  ? field.properties["relatedEntityId"]
                  : undefined,
            };
          }),
        };
      }),
    };

    return JSON.stringify({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      DataModels: resourceDetails.entities,
    });
  }
}
