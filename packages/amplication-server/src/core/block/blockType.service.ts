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
    protected readonly logger: AmplicationLogger
  ) {}

  async findOne(args: FindOneArgs): Promise<T | null> {
    return this.blockService.findOne<T>(args);
  }

  async findMany(
    args: FindManyArgs,
    user?: User,
    takeLatestVersion?: boolean
  ): Promise<T[]> {
    return this.blockService.findManyByBlockType(
      args,
      this.blockType,
      takeLatestVersion
    );
  }

  async findManyBySettings(
    args: FindManyArgs,
    settingsFilter: JsonFilter | JsonFilter[],
    settingsFilterOperator?: SettingsFilterOperator,
    takeLatestVersion?: boolean
  ): Promise<T[]> {
    return this.blockService.findManyByBlockTypeAndSettings(
      args,
      this.blockType,
      settingsFilter,
      settingsFilterOperator,
      takeLatestVersion
    );
  }

  async create(args: CreateArgs, @UserEntity() user: User): Promise<T> {
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
    keysToNotMerge?: string[]
  ): Promise<T> {
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
    deleteChildBlocksRecursive = true
  ): Promise<T> {
    return await this.blockService.delete(
      args,
      user,
      deleteChildBlocks,
      deleteChildBlocksRecursive
    );
  }
}
