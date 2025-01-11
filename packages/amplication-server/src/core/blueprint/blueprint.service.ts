import { Injectable } from "@nestjs/common";
import { isEmpty, snakeCase, toUpper } from "lodash";
import { FindOneArgs } from "../../dto";
import { AmplicationError } from "../../errors/AmplicationError";
import { Blueprint, CustomProperty } from "../../models";
import { Blueprint as PrismaBlueprint, PrismaService } from "../../prisma";
import { SegmentAnalyticsService } from "../../services/segmentAnalytics/segmentAnalytics.service";
import { EnumEventType } from "../../services/segmentAnalytics/segmentAnalyticsEventType.types";
import { prepareDeletedItemName } from "../../util/softDelete";
import { BlueprintCreateArgs } from "./dto/BlueprintCreateArgs";
import { BlueprintFindManyArgs } from "./dto/BlueprintFindManyArgs";
import { UpdateBlueprintArgs } from "./dto/UpdateBlueprintArgs";
import { BlueprintRelation } from "../../models/BlueprintRelation";
import { UpsertBlueprintRelationArgs } from "./dto/UpsertBlueprintRelationArgs";
import { JsonArray } from "type-fest";
import { DeleteBlueprintRelationArgs } from "./dto/DeleteBlueprintRelationArgs";
import { CustomPropertyService } from "../customProperty/customProperty.service";

export const INVALID_BLUEPRINT_ID = "Invalid blueprintId";

@Injectable()
export class BlueprintService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly analytics: SegmentAnalyticsService,
    private readonly customPropertyService: CustomPropertyService
  ) {}

  async blueprints(args: BlueprintFindManyArgs): Promise<Blueprint[]> {
    const properties = await this.prisma.blueprint.findMany({
      ...args,
      where: {
        ...args.where,
        deletedAt: null,
      },
    });

    return properties.map((property) => this.blueprintRecordToModel(property));
  }

  async blueprint(args: FindOneArgs): Promise<Blueprint> {
    const property = await this.prisma.blueprint.findUnique({
      ...args,
      where: {
        ...args.where,
        deletedAt: null,
      },
    });

    return this.blueprintRecordToModel(property);
  }

  async createBlueprint(args: BlueprintCreateArgs): Promise<Blueprint> {
    const key = toUpper(snakeCase(args.data.name));

    const blueprint = await this.prisma.blueprint.create({
      data: {
        ...args.data,
        enabled: true,
        key,
        workspace: {
          connect: {
            id: args.data.workspace.connect.id,
          },
        },
      },
    });
    await this.analytics.trackWithContext({
      event: EnumEventType.BlueprintCreate,
      properties: {
        name: blueprint.name,
      },
    });

    return this.blueprintRecordToModel(blueprint);
  }

  async deleteBlueprint(args: FindOneArgs): Promise<Blueprint> {
    const blueprint = await this.blueprint(args);

    if (isEmpty(blueprint)) {
      throw new AmplicationError(INVALID_BLUEPRINT_ID);
    }

    const updatedBlueprint = await this.prisma.blueprint.update({
      where: args.where,
      data: {
        name: prepareDeletedItemName(blueprint.name, blueprint.id),
        key: prepareDeletedItemName(blueprint.key, blueprint.id),
        deletedAt: new Date(),
      },
    });
    await this.analytics.trackWithContext({
      event: EnumEventType.BlueprintDelete,
      properties: {
        name: blueprint.name,
      },
    });

    return this.blueprintRecordToModel(updatedBlueprint);
  }

  async updateBlueprint(args: UpdateBlueprintArgs): Promise<Blueprint> {
    const blueprint = await this.prisma.blueprint.update({
      where: { ...args.where },
      data: {
        ...args.data,
      },
    });

    await this.analytics.trackWithContext({
      event: EnumEventType.BlueprintUpdate,
      properties: {
        name: blueprint.name,
      },
    });

    return this.blueprintRecordToModel(blueprint);
  }

  blueprintRecordToModel(record: PrismaBlueprint): Blueprint {
    if (!record) {
      return null;
    }
    return {
      ...record,
      relations: record.relations
        ? (record.relations as unknown as BlueprintRelation[])
        : null,
    };
  }

  async upsertRelation(
    args: UpsertBlueprintRelationArgs
  ): Promise<BlueprintRelation> {
    const blueprint = await this.blueprint({
      where: { id: args.where.blueprint.id },
    });
    if (!blueprint) {
      throw new AmplicationError(
        `Blueprint not found, ID: ${args.where.blueprint.id}`
      );
    }

    let newOrUpdatedRelation: BlueprintRelation;

    if (!blueprint.relations) {
      blueprint.relations = [];
    }

    const currentRelationIndex = blueprint.relations?.findIndex(
      (relation) => relation.key === args.where.relationKey
    );

    const currentRelation = blueprint.relations[currentRelationIndex];

    //validate the relatedTo is a valid blueprint key
    if (args.data.relatedTo !== currentRelation?.relatedTo) {
      const relatedToBlueprint = await this.blueprints({
        where: {
          key: {
            equals: args.data.relatedTo,
          },
        },
      });

      if (!relatedToBlueprint) {
        throw new AmplicationError(
          `Related blueprint not found, key: ${args.data.relatedTo}`
        );
      }
    }

    // validate the relation key is unique
    if (
      args.data.key !== currentRelation?.key &&
      blueprint.relations.some((relation) => relation.key === args.data.key)
    ) {
      throw new AmplicationError(
        `Relation key must be unique, key: ${args.where.relationKey}`
      );
    }

    if (currentRelationIndex === -1) {
      newOrUpdatedRelation = {
        ...args.data,
        key: args.where.relationKey,
      };

      blueprint.relations.push(newOrUpdatedRelation);
    } else {
      newOrUpdatedRelation = blueprint.relations[currentRelationIndex];

      newOrUpdatedRelation = {
        ...newOrUpdatedRelation,
        ...args.data,
      };

      blueprint.relations[currentRelationIndex] = newOrUpdatedRelation;
    }

    await this.prisma.blueprint.update({
      where: {
        id: args.where.blueprint.id,
      },
      data: {
        relations: blueprint.relations as unknown as JsonArray,
      },
    });

    return newOrUpdatedRelation;
  }

  async deleteRelation(
    args: DeleteBlueprintRelationArgs
  ): Promise<BlueprintRelation> {
    const blueprint = await this.blueprint({
      where: { id: args.where.blueprint.id },
    });
    if (!blueprint) {
      throw new AmplicationError(
        `Blueprint not found, ID: ${args.where.blueprint.id}`
      );
    }

    const currentRelationIndex = blueprint.relations?.findIndex(
      (relation) => relation.key === args.where.relationKey
    );

    if (currentRelationIndex === -1) {
      throw new AmplicationError(
        `Relation not found, key: ${args.where.relationKey}`
      );
    }

    const [deleted] = blueprint.relations.splice(currentRelationIndex, 1);

    await this.prisma.blueprint.update({
      where: {
        id: args.where.blueprint.id,
      },
      data: {
        relations: blueprint.relations as unknown as JsonArray,
      },
    });

    return deleted;
  }

  async properties(args: FindOneArgs): Promise<CustomProperty[]> {
    return this.customPropertyService.customProperties({
      where: {
        blueprintId: args.where.id,
      },
    });
  }
}
