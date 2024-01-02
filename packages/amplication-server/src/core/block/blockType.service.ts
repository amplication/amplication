import { Injectable } from "@nestjs/common";
import { FindOneArgs } from "../../dto";
import { IBlock, User } from "../../models";
import { EnumBlockType } from "../../enums/EnumBlockType";
import { BlockService } from "../block/block.service";
import {
  CreateBlockArgs,
  FindManyBlockTypeArgs,
  UpdateBlockArgs,
} from "../block/dto";
import { UserEntity } from "../../decorators/user.decorator";
import { DeleteBlockArgs } from "./dto/DeleteBlockArgs";
import { JsonFilter } from "../../dto/JsonFilter";
@Injectable()
export abstract class BlockTypeService<
  T extends IBlock,
  FindManyArgs extends FindManyBlockTypeArgs,
  CreateArgs extends CreateBlockArgs,
  UpdateArgs extends UpdateBlockArgs,
  DeleteArgs extends DeleteBlockArgs
> {
  abstract blockType: EnumBlockType;

  constructor(protected readonly blockService: BlockService) {}

  async findOne(args: FindOneArgs): Promise<T | null> {
    return this.blockService.findOne<T>(args);
  }

  async findMany(args: FindManyArgs): Promise<T[]> {
    return this.blockService.findManyByBlockType(args, this.blockType);
  }

  async findManyBySettings(
    args: FindManyArgs,
    settingsFilter: JsonFilter
  ): Promise<T[]> {
    return this.blockService.findManyByBlockTypeAndSettings(
      args,
      this.blockType,
      settingsFilter
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
    notMergeSettings?: boolean
  ): Promise<T> {
    return this.blockService.update<T>(
      {
        ...args,
      },
      user,
      notMergeSettings
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
