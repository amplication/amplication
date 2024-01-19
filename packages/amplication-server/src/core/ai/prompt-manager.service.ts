import { EnumDataType } from "../../prisma";
import {
  BreakTheMonolithPromptInput,
  GeneratePromptForBreakTheMonolithArgs,
} from "./prompt-manager.types";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PromptManagerService {
  generatePromptForBreakTheMonolith(
    resource: GeneratePromptForBreakTheMonolithArgs
  ): string {
    const entityIdNameMap = resource.entities.reduce((acc, entity) => {
      acc[entity.id] = entity.name;
      return acc;
    });

    const prompt: BreakTheMonolithPromptInput = {
      dataModels: resource.entities.map((entity) => {
        return {
          name: entity.name,
          fields: entity.versions[0].fields.map((field) => {
            return {
              name: field.name,
              dataType:
                field.dataType == EnumDataType.Lookup
                  ? entityIdNameMap[field.properties["relatedEntityId"]]
                  : field.dataType,
            };
          }),
        };
      }),
    };

    return JSON.stringify(prompt);
  }
}
