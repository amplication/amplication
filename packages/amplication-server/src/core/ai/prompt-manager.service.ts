/* eslint-disable @typescript-eslint/naming-convention */
import { EnumDataType } from "../../prisma";
import {
  BreakTheMonolithPromptInput,
  BreakTheMonolithPromptOutput,
} from "./prompt-manager.types";
import { Injectable } from "@nestjs/common";
import { AiBadFormatResponseError } from "./errors/ai-bad-format-response.error";
import { ResourcePartial } from "./ai.types";

@Injectable()
export class PromptManagerService {
  private dataTypeMap: Record<keyof typeof EnumDataType, string> = {
    SingleLineText: "string",
    MultiLineText: "string",
    Email: "string",
    WholeNumber: "int",
    DateTime: "datetime",
    DecimalNumber: "float",
    Lookup: "enum",
    MultiSelectOptionSet: "enum",
    OptionSet: "enum",
    Boolean: "bool",
    GeographicLocation: "string",
    Id: "int",
    CreatedAt: "datetime",
    UpdatedAt: "datetime",
    Roles: "string",
    Username: "string",
    Password: "string",
    Json: "string",
  };

  generatePromptForBreakTheMonolith(resource: ResourcePartial): string {
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
                  : this.dataTypeMap[field.dataType],
            };
          }),
        };
      }),
    };

    return JSON.stringify(prompt);
  }

  parsePromptResult(promptResult: string): BreakTheMonolithPromptOutput {
    try {
      const result = JSON.parse(promptResult);

      return {
        microservices: result.microservices.map((microservice) => ({
          name: microservice.name,
          functionality: microservice.functionality,
          dataModels: microservice.dataModels,
        })),
      };
    } catch (error) {
      throw new AiBadFormatResponseError(promptResult, error);
    }
  }
}
