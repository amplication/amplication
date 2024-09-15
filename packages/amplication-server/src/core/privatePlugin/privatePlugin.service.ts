import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { Injectable } from "@nestjs/common";
import { EnumBlockType } from "../../enums/EnumBlockType";
import { BlockService } from "../block/block.service";
import { BlockTypeService } from "../block/blockType.service";
import { CreatePrivatePluginArgs } from "./dto/CreatePrivatePluginArgs";
import { FindManyPrivatePluginArgs } from "./dto/FindManyPrivatePluginArgs";
import { PrivatePlugin } from "./dto/PrivatePlugin";
import { UpdatePrivatePluginArgs } from "./dto/UpdatePrivatePluginArgs";
import { DeletePrivatePluginArgs } from "./dto/DeletePrivatePluginArgs";
import { User } from "../../models";
import { BillingService } from "../billing/billing.service";
import { BillingFeature } from "@amplication/util-billing-types";
import { AmplicationError } from "../../errors/AmplicationError";
import { ResourceService } from "../resource/resource.service";

@Injectable()
export class PrivatePluginService extends BlockTypeService<
  PrivatePlugin,
  FindManyPrivatePluginArgs,
  CreatePrivatePluginArgs,
  UpdatePrivatePluginArgs,
  DeletePrivatePluginArgs
> {
  blockType = EnumBlockType.PrivatePlugin;

  constructor(
    protected readonly blockService: BlockService,
    protected readonly logger: AmplicationLogger,
    protected readonly billingService: BillingService,
    protected readonly resourceService: ResourceService
  ) {
    super(blockService, logger);
  }

  //return all private plugins in the resource's project
  //disabled plugins can be used for setup - but should not be used in build time
  async availablePrivatePluginsForResource(
    args: FindManyPrivatePluginArgs
  ): Promise<PrivatePlugin[]> {
    const resource = await this.resourceService.resource({
      where: {
        id: args.where?.resource.id,
      },
    });

    if (!resource) {
      return [];
    }

    return await this.findMany({
      ...args,
      where: {
        ...args.where,
        resource: {
          deletedAt: null,
          archived: {
            not: true,
          },
          projectId: resource.projectId,
        },
      },
    });
  }

  async create(
    args: CreatePrivatePluginArgs,
    user: User
  ): Promise<PrivatePlugin> {
    await this.validateLicense(user.workspace?.id);

    return super.create(args, user);
  }

  async validateLicense(workspaceId: string): Promise<void> {
    const entitlement = await this.billingService.getBooleanEntitlement(
      workspaceId,
      BillingFeature.PrivatePlugins
    );

    if (entitlement && !entitlement.hasAccess)
      throw new AmplicationError(
        `Feature Unavailable. Please upgrade your plan to use the Private Plugins Module.`
      );
  }
}
