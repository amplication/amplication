import { Injectable } from "@nestjs/common";
import {
  BreakTheMonolithPromptOutput,
  ResourcePartial,
} from "./prompt-manager.types";
import { BtmRecommendation } from "../../models";
import { BtmEntityRecommendation } from "../../prisma";

@Injectable()
export class BtmManagerService {
  duplicatedEntities(entites: string[]): Set<string> {
    return new Set(
      entites.filter((entity, index) => {
        return entites.indexOf(entity) !== index;
      })
    );
  }

  translateToBtmRecommendation(
    actionId: string,
    promptResult: BreakTheMonolithPromptOutput,
    originalResource: ResourcePartial
  ): BtmRecommendation {
    return {
      actionId,
      resources: promptResult.microservices.map((microservice) => ({
        id: undefined,
        name: microservice.name,
        description: microservice.functionality,
        entities: microservice.dataModels.map(
          (dataModelName) =>
            <BtmEntityRecommendation>{
              id: undefined,
              name: dataModelName,
              fields:
                originalResource.entities
                  ?.find((x) => x.name === dataModelName)
                  ?.versions[0]?.fields.map((field) => field.name) ?? [],
            }
        ),
      })),
    };
  }
}
