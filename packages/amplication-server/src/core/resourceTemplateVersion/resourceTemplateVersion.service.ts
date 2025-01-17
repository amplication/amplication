import { Injectable } from "@nestjs/common";
import { FindOneArgs } from "../../dto";
import { EnumBlockType } from "../../enums/EnumBlockType";
import { User } from "../../models";
import { BlockService } from "../block/block.service";
import {
  DEFAULT_RESOURCE_TEMPLATE_VERSION,
  ResourceTemplateVersionValues,
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

  async getServiceIdsByTemplateId(
    workspaceId: string,
    templateId: string
  ): Promise<string[]> {
    const blocks = await this.blockService.findManyByBlockTypeAndSettings(
      {
        where: {
          resource: {
            deletedAt: null,
            archived: { not: true },

            project: {
              workspace: {
                id: workspaceId,
              },
            },
          },
        },
      },
      EnumBlockType.ResourceTemplateVersion,
      {
        path: ["serviceTemplateId"],
        equals: templateId,
      }
    );

    return blocks.map((block) => block.resourceId);
  }
}
