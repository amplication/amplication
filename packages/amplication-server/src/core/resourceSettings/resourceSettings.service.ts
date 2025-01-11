import { forwardRef, Inject, Injectable } from "@nestjs/common";
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
import { ResourceService } from "../resource/resource.service";
import { BlueprintService } from "../blueprint/blueprint.service";
import { CustomPropertyService } from "../customProperty/customProperty.service";
import { AmplicationError } from "../../errors/AmplicationError";

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
    private readonly blockService: BlockService,
    @Inject(forwardRef(() => ResourceService))
    private readonly resourceService: ResourceService,
    private readonly blueprintService: BlueprintService,
    private readonly customPropertyService: CustomPropertyService
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

  async validateResourceSettingsProperties(
    resourceId: string,
    properties: Record<string, unknown>
  ): Promise<void> {
    if (!properties || Object.keys(properties).length === 0) {
      return;
    }

    const resource = await this.resourceService.resource({
      where: {
        id: resourceId,
      },
    });

    if (!resource) {
      throw new Error(`Resource not found with id ${resourceId}`);
    }

    if (!resource.blueprintId) {
      throw new Error(`Blueprint not found for resource with id ${resourceId}`);
    }

    const blueprintProperties = await this.blueprintService.properties({
      where: {
        id: resource.blueprintId,
      },
    });

    const validationResults =
      await this.customPropertyService.validateCustomProperties(
        blueprintProperties,
        properties
      );

    if (!validationResults.isValid) {
      throw new AmplicationError(
        `Validation failed for resource settings properties: ${validationResults.errorText}`
      );
    }
  }

  async updateResourceSettings(
    args: UpdateResourceSettingsArgs,
    user: User
  ): Promise<ResourceSettings> {
    await this.validateResourceSettingsProperties(
      args.where.id,
      args.data.properties as Record<string, unknown>
    );

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
