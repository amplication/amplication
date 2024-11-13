import { Injectable } from "@nestjs/common";
import { isEmpty, snakeCase, toUpper } from "lodash";
import { FindOneArgs } from "../../dto";
import { AmplicationError } from "../../errors/AmplicationError";
import { Blueprint } from "../../models";
import { Blueprint as PrismaBlueprint, PrismaService } from "../../prisma";
import { SegmentAnalyticsService } from "../../services/segmentAnalytics/segmentAnalytics.service";
import { EnumEventType } from "../../services/segmentAnalytics/segmentAnalyticsEventType.types";
import { prepareDeletedItemName } from "../../util/softDelete";
import { BlueprintCreateArgs } from "./dto/BlueprintCreateArgs";
import { BlueprintFindManyArgs } from "./dto/BlueprintFindManyArgs";
import { UpdateBlueprintArgs } from "./dto/UpdateBlueprintArgs";

export const INVALID_BLUEPRINT_ID = "Invalid blueprintId";

@Injectable()
export class BlueprintService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly analytics: SegmentAnalyticsService
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

  //we keep this for future json properties like blocks
  blueprintRecordToModel(record: PrismaBlueprint): Blueprint {
    if (!record) {
      return null;
    }
    return {
      ...record,
    };
  }
}
