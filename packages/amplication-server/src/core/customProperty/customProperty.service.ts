import { Injectable } from "@nestjs/common";
import { isEmpty, snakeCase, toUpper } from "lodash";
import { FindOneArgs } from "../../dto";
import { AmplicationError } from "../../errors/AmplicationError";
import { CustomProperty } from "../../models";
import { PrismaService } from "../../prisma";
import { SegmentAnalyticsService } from "../../services/segmentAnalytics/segmentAnalytics.service";
import { EnumEventType } from "../../services/segmentAnalytics/segmentAnalyticsEventType.types";
import { prepareDeletedItemName } from "../../util/softDelete";
import { CustomPropertyCreateArgs } from "./dto/CustomPropertyCreateArgs";
import { CustomPropertyFindManyArgs } from "./dto/CustomPropertyFindManyArgs";
import { EnumCustomPropertyType } from "./dto/EnumCustomPropertyType";
import { UpdateCustomPropertyArgs } from "./dto/UpdateCustomPropertyArgs";

export const INVALID_CUSTOM_PROPERTY_ID = "Invalid customPropertyId";

@Injectable()
export class CustomPropertyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly analytics: SegmentAnalyticsService
  ) {}

  async customProperties(
    args: CustomPropertyFindManyArgs
  ): Promise<CustomProperty[]> {
    return this.prisma.customProperty.findMany({
      ...args,
      where: {
        ...args.where,
        deletedAt: null,
      },
    });
  }

  async customProperty(args: FindOneArgs): Promise<CustomProperty> {
    return this.prisma.customProperty.findUnique({
      ...args,
      where: {
        ...args.where,
        deletedAt: null,
      },
    });
  }

  async createCustomProperty(
    args: CustomPropertyCreateArgs
  ): Promise<CustomProperty> {
    const key = toUpper(snakeCase(args.data.name));

    const customProperty = await this.prisma.customProperty.create({
      data: {
        ...args.data,
        type: EnumCustomPropertyType.Select,
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
      event: EnumEventType.CustomPropertyCreate,
      properties: {
        name: customProperty.name,
      },
    });

    return customProperty;
  }

  async deleteCustomProperty(args: FindOneArgs): Promise<CustomProperty> {
    const customProperty = await this.customProperty(args);

    if (isEmpty(customProperty)) {
      throw new AmplicationError(INVALID_CUSTOM_PROPERTY_ID);
    }

    const updatedCustomProperty = this.prisma.customProperty.update({
      where: args.where,
      data: {
        name: prepareDeletedItemName(customProperty.name, customProperty.id),
        deletedAt: new Date(),
      },
    });
    await this.analytics.trackWithContext({
      event: EnumEventType.CustomPropertyDelete,
      properties: {
        name: customProperty.name,
      },
    });

    return updatedCustomProperty;
  }

  async updateCustomProperty(
    args: UpdateCustomPropertyArgs
  ): Promise<CustomProperty> {
    const customProperty = await this.prisma.customProperty.update({
      where: { ...args.where },
      data: {
        ...args.data,
      },
    });

    await this.analytics.trackWithContext({
      event: EnumEventType.CustomPropertyUpdate,
      properties: {
        name: customProperty.name,
      },
    });

    return customProperty;
  }
}
