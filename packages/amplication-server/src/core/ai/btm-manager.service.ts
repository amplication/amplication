import { Injectable } from "@nestjs/common";
import {
  BreakTheMonolithPromptOutput,
  ResourcePartial,
} from "./prompt-manager.types";
import { BtmEntityRecommendation } from "../../prisma";
import { BtmRecommendation } from "./dto";

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
    // validate all the entities in the original resource are present
    // at most once in the recommended resources and vice versa
    const recommendedResourceEntities = promptResult.microservices
      .map((resource) => resource.dataModels)
      .flat();

    const duplicatedEntities = this.duplicatedEntities(
      recommendedResourceEntities
    );
    const usedDuplicatedEntities = new Set<string>();

    const originalResourceEntitiesSet = new Set(
      originalResource.entities.map((entity) => entity.name)
    );

    return {
      actionId,
      resources: promptResult.microservices
        .sort((microservice) => -1 * microservice.dataModels.length)
        .map((microservice) => ({
          id: undefined,
          name: microservice.name,
          description: microservice.functionality,
          entities: microservice.dataModels
            .filter((dataModelName) => {
              const isDuplicatedAlreadyUsed =
                usedDuplicatedEntities.has(dataModelName);
              if (duplicatedEntities.has(dataModelName)) {
                usedDuplicatedEntities.add(dataModelName);
              }
              return (
                originalResourceEntitiesSet.has(dataModelName) &&
                !isDuplicatedAlreadyUsed
              );
            })
            .map(
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
