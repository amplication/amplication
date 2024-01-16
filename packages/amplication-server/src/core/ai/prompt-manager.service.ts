import { BtmRecommendation } from "../../models/BtmRecommendation/BtmRecommendation";
import { BtmEntityRecommendation, EnumDataType } from "../../prisma";
import {
  BreakTheMonolithPromptInput,
  BreakTheMonolithPromptOutput,
  GeneratePromptForBreakTheMonolithArgs,
} from "./prompt-manager.types";
import { Injectable } from "@nestjs/common";
import { AiBadFormatResponseError } from "./ai.errors";

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

  generateResourcesFromPromptResult(promptResult: string): BtmRecommendation {
    try {
      const result: BreakTheMonolithPromptOutput = JSON.parse(promptResult);

      return {
        actionId: "",
        resources: result.microservices.map((microservice) => ({
          id: "",
          name: microservice.name,
          description: microservice.functionality,
          entities: microservice.dataModels.map(
            (dataModel) =>
              <BtmEntityRecommendation>{
                id: "",
                name: dataModel.name,
                fields: dataModel.fields.map((field) => field.name),
              }
          ),
        })),
      };
    } catch (error) {
      throw new AiBadFormatResponseError(promptResult, error);
    }
  }
}
