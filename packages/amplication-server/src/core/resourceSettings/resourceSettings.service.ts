import { Injectable } from "@nestjs/common";
import { FindOneArgs } from "../../dto";
import { EnumBlockType } from "../../enums/EnumBlockType";
import { User } from "../../models";
import { PrismaService } from "../../prisma";
import { BlockService } from "../block/block.service";
import { ResourceSettingsValues } from "./constants";
import { ResourceSettings, UpdateResourceSettingsArgs } from "./dto";

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
