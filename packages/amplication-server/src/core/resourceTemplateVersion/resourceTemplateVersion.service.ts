import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { FindOneArgs } from "../../dto";
import { EnumBlockType } from "../../enums/EnumBlockType";
import { User } from "../../models";
import { PrismaService } from "../../prisma";
import { BlockService } from "../block/block.service";
import {
  ResourceTemplateVersionValues,
  DEFAULT_RESOURCE_TEMPLATE_VERSION,
} from "./constants";
import {
  ResourceTemplateVersion,
  UpdateResourceTemplateVersionArgs,
} from "./dto";

@Injectable()
export class ResourceTemplateVersionService {
  constructor(private readonly blockService: BlockService) {}

  async getResourceTemplateVersionValues(
    args: FindOneArgs,
    user: User
  ): Promise<ResourceTemplateVersionValues> {
    const { serviceTemplateId, version } =
      (await this.getResourceTemplateVersionBlock(args)) || {};

    return {
      resourceId: args.where.id,
      serviceTemplateId,
      version,
    };
  }

  async getResourceTemplateVersionBlock(
    args: FindOneArgs
  ): Promise<ResourceTemplateVersion> {
    const [resourceTemplateVersion] =
      await this.blockService.findManyByBlockType<ResourceTemplateVersion>(
        {
          where: {
            resource: {
              id: args.where.id,
            },
          },
        },
        EnumBlockType.ResourceTemplateVersion
      );

    return resourceTemplateVersion;
  }

  async updateResourceTemplateVersion(
    args: UpdateResourceTemplateVersionArgs,
    user: User
  ): Promise<ResourceTemplateVersion> {
    const resourceTemplateVersionBlock =
      await this.getResourceTemplateVersionBlock({
        where: { id: args.where.id },
      });

    if (!resourceTemplateVersionBlock) {
      return this.blockService.create<ResourceTemplateVersion>(
        {
          data: {
            ...DEFAULT_RESOURCE_TEMPLATE_VERSION,
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

    return this.blockService.update<ResourceTemplateVersion>(
      {
        where: {
          id: resourceTemplateVersionBlock.id,
        },
        data: {
          ...args.data,
        },
      },
      user
    );
  }
}
