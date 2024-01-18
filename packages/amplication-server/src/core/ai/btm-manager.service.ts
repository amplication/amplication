import { Injectable } from "@nestjs/common";
import { BreakTheMonolithPromptOutput } from "./prompt-manager.types";
import { BtmRecommendation } from "./dto";
import { EntityPartial, ResourcePartial } from "./ai.types";

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
            .map((dataModelName) => {
              const entityNameIdMap = originalResource.entities.reduce(
                (map, entity) => {
                  map[entity.name] = entity;
                  return map;
                },
                {} as Record<string, EntityPartial>
              );

              return {
                id: undefined,
                name: dataModelName,
                fields:
                  entityNameIdMap[dataModelName]?.versions[0]?.fields.map(
                    (field) => field.name
                  ) ?? [],
                originalEntityId: entityNameIdMap[dataModelName]?.id,
              };
            }),
        })),
    };
  }
}
