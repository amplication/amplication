import { Injectable } from "@nestjs/common";
import { FindOneArgs } from "../../dto";
import { EnumBlockType } from "../../enums/EnumBlockType";
import { User } from "../../models";
import { PrismaService } from "../../prisma";
import { BlockService } from "../block/block.service";
import {
  ResourceSettingsValues,
  ResourceSettingsValuesExtended,
} from "./constants";
import { ResourceSettings, UpdateResourceSettingsArgs } from "./dto";

export const DEFAULT_RESOURCE_SETTINGS: ResourceSettingsValuesExtended = {
  blockType: EnumBlockType.ResourceSettings,
  description: "",
  displayName: "Resource Settings",
  properties: {},
};

@Injectable()
export class ResourceSettingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly blockService: BlockService
  ) {}

  async getResourceSettingsValues(
    args: FindOneArgs,
    user: User
  ): Promise<ResourceSettingsValues> {
    const { properties } = await this.getResourceSettingsBlock(args);

    return {
      resourceId: args.where.id,
      properties,
    };
  }

  async getResourceSettingsBlock(args: FindOneArgs): Promise<ResourceSettings> {
    const [resourceSettings] =
      await this.blockService.findManyByBlockType<ResourceSettings>(
        {
          where: {
            resource: {
              id: args.where.id,
            },
          },
        },
        EnumBlockType.ResourceSettings
      );

    return resourceSettings;
  }

  async updateResourceSettings(
    args: UpdateResourceSettingsArgs,
    user: User
  ): Promise<ResourceSettings> {
    const resourceSettingsBlock = await this.getResourceSettingsBlock({
      where: { id: args.where.id },
    });

    if (!resourceSettingsBlock) {
      return this.blockService.create<ResourceSettings>(
        {
          data: {
            ...DEFAULT_RESOURCE_SETTINGS,
            resource: {
              connect: {
                id: args.where.id,
              },
            },
            ...args.data,
          },
        },
        user.id
      );
    }

    return this.blockService.update<ResourceSettings>(
      {
        where: {
          id: resourceSettingsBlock.id,
        },
        data: {
          ...args.data,
        },
      },
      user
    );
  }
}
