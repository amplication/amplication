import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { EnumBlockType } from "../../enums/EnumBlockType";
import { User } from "../../models";
import { Prisma, PrismaService, ResourceRelationCache } from "../../prisma";
import { BlockService } from "../block/block.service";
import { BlockTypeService } from "../block/blockType.service";
import { BlueprintService } from "../blueprint/blueprint.service";
import { CreateRelationArgs } from "./dto/CreateRelationArgs";
import { DeleteRelationArgs } from "./dto/DeleteRelationArgs";
import { FindManyRelationArgs } from "./dto/FindManyRelationArgs";
import { Relation } from "./dto/Relation";
import { UpdateRelationArgs } from "./dto/UpdateRelationArgs";
import { UpdateResourceRelationArgs } from "./dto/UpdateResourceRelationArgs";
@Injectable()
export class RelationService extends BlockTypeService<
  Relation,
  FindManyRelationArgs,
  CreateRelationArgs,
  UpdateRelationArgs,
  DeleteRelationArgs
> {
  blockType = EnumBlockType.Relation;

  constructor(
    protected readonly blockService: BlockService,
    protected readonly logger: AmplicationLogger,
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => BlueprintService))
    private readonly blueprintService: BlueprintService
  ) {
    super(blockService, logger);
  }

  async create(args: CreateRelationArgs, user: User): Promise<Relation> {
    throw new Error(
      "Method not implemented. use updateResourceRelation instead"
    );
  }

  async update(args: UpdateRelationArgs, user: User): Promise<Relation> {
    throw new Error(
      "Method not implemented. use updateResourceRelation instead"
    );
  }

  async updateResourceRelation(
    args: UpdateResourceRelationArgs,
    user: User
  ): Promise<Relation> {
    const { relationKey } = args.data;

    const existingRelation = await super.findManyBySettings(
      {
        where: {
          resource: {
            id: args.resource.id,
          },
        },
      },
      [
        {
          path: ["relationKey"],
          equals: relationKey,
        },
      ]
    );

    let results: Relation;

    if (!existingRelation || existingRelation.length === 0) {
      const createArgs: CreateRelationArgs = {
        data: {
          ...args.data,
          displayName: args.data.relationKey,
          resource: {
            connect: {
              id: args.resource.id,
            },
          },
        },
      };

      results = await super.create(createArgs, user);
    } else {
      const updateArgs: UpdateRelationArgs = {
        where: {
          id: existingRelation[0].id,
        },
        data: {
          ...args.data,
          displayName: args.data.relationKey,
        },
      };

      results = await super.update(updateArgs, user);
    }

    await this.updateResourceRelationCache(args.resource.id);

    return results;
  }

  /**
   * Update the resource relation cache for all resources in the workspace
   * @param workspaceId - The ID of the workspace to update the resource relation cache for
   */
  async updateWorkspaceResourceRelationCache(workspaceId: string) {
    const resources = await this.prisma.resource.findMany({
      where: {
        project: {
          workspaceId,
        },
        deletedAt: null,
        archived: { not: true },
      },
    });

    for (const resource of resources) {
      await this.updateResourceRelationCache(resource.id);
    }
  }

  /**
   * Update the resource relation cache for all resources in the blueprint
   * @param blueprintId - The ID of the blueprint to update the resource relation cache for
   */
  async updateBlueprintResourceRelationCache(blueprintId: string) {
    const resources = await this.prisma.resource.findMany({
      where: {
        blueprintId,
        deletedAt: null,
        archived: { not: true },
      },
    });

    for (const resource of resources) {
      await this.updateResourceRelationCache(resource.id);
    }
  }

  async updateResourceRelationCache(resourceId: string) {
    const relations = await this.findMany({
      where: {
        resource: {
          id: resourceId,
        },
      },
    });

    const resource = await this.prisma.resource.findUnique({
      where: {
        id: resourceId,
      },
    });

    if (!resource) {
      this.logger.error(
        `Cannot update resource relation cache for resource ${resourceId} because it does not exist`
      );
      return;
    }

    const blueprint = await this.blueprintService.blueprint({
      where: {
        id: resource.blueprintId,
      },
    });

    if (!blueprint) {
      this.logger.error(
        `Cannot update resource relation cache for resource ${resourceId} because it does not have a blueprint`
      );
      return;
    }

    const createRecords: Prisma.ResourceRelationCacheCreateManyInput[] = [];

    await this.prisma.resourceRelationCache.deleteMany({
      where: {
        parentResourceId: resourceId,
      },
    });

    const relationMap = blueprint.relations.reduce((acc, relation) => {
      acc[relation.key] = relation;
      return acc;
    }, {});

    //create all the records for the parent resource
    for (const relation of relations) {
      for (const relatedResourceId of relation.relatedResources) {
        createRecords.push({
          parentResourceId: resourceId,
          relationKey: relation.relationKey,
          childResourceId: relatedResourceId,
          parentShouldBuildWithChild:
            relationMap[relation.relationKey].parentShouldBuildWithChild,
        });
      }
    }

    await this.prisma.resourceRelationCache.deleteMany({
      where: {
        parentResourceId: resourceId,
      },
    });

    await this.prisma.resourceRelationCache.createMany({
      data: createRecords,
    });
  }

  /**
   * Get the buildable parents for the list of given resources
   * @param resourceIds - The IDs of the resources to get the buildable parents for
   * @returns The buildable parents for the resources
   */
  private async getBuildableParents(
    resourceIds: string[]
  ): Promise<ResourceRelationCache[]> {
    return this.prisma.resourceRelationCache.findMany({
      where: {
        parentShouldBuildWithChild: true,
        childResourceId: { in: resourceIds },
      },
    });
  }

  /**
   * Get the related resources for cascading builds for the list of given resources.
   * This version processes all IDs in the queue in batches, using a Set to track visited IDs.
   * @param resourceIds - The IDs of the resources to get the cascading builds for
   * @returns The cascading builds for the resources
   */
  async getCascadingBuildableResourceIds(
    resourceIds: string[]
  ): Promise<string[]> {
    // Set to track all processed buildable parent IDs.
    const visited = new Set<string>(resourceIds);
    // Queue for processing new resource IDs.
    let queue = [...resourceIds];

    while (queue.length > 0) {
      // Process the entire batch of queued IDs at once.
      const currentBatch = queue;
      // Reset queue for the next batch.
      queue = [];
      try {
        // Fetch buildable parents for the current batch.
        const newParents = await this.getBuildableParents(currentBatch);

        // Process each parent from the batch.
        for (const parent of newParents) {
          const parentId = parent.parentResourceId;
          // Only queue IDs that haven't been processed yet.
          if (!visited.has(parentId)) {
            visited.add(parentId);
            queue.push(parentId);
          }
        }
      } catch (error) {
        this.logger.error(`Failed to get buildable parents: ${error}`, error);
        return Array.from(visited); //return the visited ids so far
      }
    }

    // Return the accumulated buildable parent IDs.
    return Array.from(visited);
  }
}
