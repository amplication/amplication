import { Injectable } from "@nestjs/common";
import { FindOneArgs } from "../../dto";
import { IBlock, User } from "../../models";
import { EnumBlockType } from "../../enums/EnumBlockType";
import { BlockService, SettingsFilterOperator } from "../block/block.service";
import {
  CreateBlockArgs,
  FindManyBlockTypeArgs,
  UpdateBlockArgs,
} from "../block/dto";
import { UserEntity } from "../../decorators/user.decorator";
import { DeleteBlockArgs } from "./dto/DeleteBlockArgs";
import { JsonFilter } from "../../dto/JsonFilter";
import { BillingService } from "../billing/billing.service";
import { BillingFeature } from "@amplication/util-billing-types";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
@Injectable()
export abstract class BlockTypeService<
  T extends IBlock,
  FindManyArgs extends FindManyBlockTypeArgs,
  CreateArgs extends CreateBlockArgs,
  UpdateArgs extends UpdateBlockArgs,
  DeleteArgs extends DeleteBlockArgs
> {
  abstract blockType: EnumBlockType;

  constructor(
    protected readonly blockService: BlockService,
    protected readonly billingService: BillingService,
    protected readonly logger: AmplicationLogger
  ) {}

  async findOne(args: FindOneArgs): Promise<T | null> {
    return this.blockService.findOne<T>(args);
  }

  async findMany(args: FindManyArgs): Promise<T[]> {
    return this.blockService.findManyByBlockType(args, this.blockType);
  }

  async findManyBySettings(
    args: FindManyArgs,
    settingsFilter: JsonFilter | JsonFilter[],
    settingsFilterOperator?: SettingsFilterOperator
  ): Promise<T[]> {
    return this.blockService.findManyByBlockTypeAndSettings(
      args,
      this.blockType,
      settingsFilter,
      settingsFilterOperator
    );
  }

  async create(
    args: CreateArgs,
    @UserEntity() user: User,
    forceEntitlementValidation = false
  ): Promise<T> {
    if (forceEntitlementValidation)
      await this.validateEntitlementForBlockType(
        this.blockType,
        user.workspace.id
      );
    return this.blockService.create<T>(
      {
        ...args,
        data: {
          ...args.data,
          blockType: this.blockType,
        },
      },
      user.id
    );
  }

  async update(
    args: UpdateArgs,
    @UserEntity() user: User,
    keysToNotMerge?: string[],
    forceEntitlementValidation = false
  ): Promise<T> {
    if (forceEntitlementValidation)
      await this.validateEntitlementForBlockType(
        this.blockType,
        user.workspace.id
      );
    return this.blockService.update<T>(
      {
        ...args,
      },
      user,
      keysToNotMerge
    );
  }

  async delete(
    args: DeleteArgs,
    @UserEntity() user: User,
    deleteChildBlocks = false,
    deleteChildBlocksRecursive = true,
    forceEntitlementValidation = false
  ): Promise<T> {
    if (forceEntitlementValidation)
      await this.validateEntitlementForBlockType(
        this.blockType,
        user.workspace.id
      );
    return await this.blockService.delete(
      args,
      user,
      deleteChildBlocks,
      deleteChildBlocksRecursive
    );
  }

  async validateCustomActionsEntitlement(workspaceId: string): Promise<void> {
    try {
      const customActionEntitlement =
        await this.billingService.getBooleanEntitlement(
          workspaceId,
          BillingFeature.CustomActions
        );

      if (!customActionEntitlement.hasAccess) {
        throw new Error("User has no access to custom actions features");
      }
    } catch (error) {
      this.logger.error(error.message, error);
    }
  }

  async validateEntitlementForBlockType(
    blockType: EnumBlockType,
    workspaceId: string
  ): Promise<void> {
    switch (blockType) {
      case EnumBlockType.Module ||
        EnumBlockType.ModuleAction ||
        EnumBlockType.ModuleDto:
        return await this.validateCustomActionsEntitlement(workspaceId);
      default:
        return;
    }
  }
}
