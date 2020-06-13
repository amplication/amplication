import { Injectable, Inject } from '@nestjs/common';
import { FindOneWithVersionArgs } from 'src/dto';
import { IBlock } from 'src/models';
import { EnumBlockType } from 'src/enums/EnumBlockType';
import { BlockService } from '../block/block.service';
import {
  CreateBlockArgs,
  FindManyBlockArgs,
  BlockWhereInput,
  BlockCreateInput
} from '../block/dto';

export type FindManyArgsWithoutBlockType = Omit<FindManyBlockArgs, 'where'> & {
  where?: Omit<BlockWhereInput, 'blockType'>;
};
export type CreateArgsWithoutBlockType = Omit<CreateBlockArgs, 'data'> & {
  data: Omit<BlockCreateInput, 'blockType'>;
};

@Injectable()
export abstract class BlockTypeService<
  T extends IBlock,
  FindManyArgs extends FindManyArgsWithoutBlockType,
  CreateArgs extends CreateArgsWithoutBlockType
> {
  abstract blockType: EnumBlockType;

  @Inject()
  private readonly blockService: BlockService;

  async findOne(args: FindOneWithVersionArgs): Promise<T | null> {
    return this.blockService.findOne<T>(args);
  }

  async findMany(args: FindManyArgs): Promise<T[]> {
    return this.blockService.findManyByBlockType(args, this.blockType);
  }

  async create(args: CreateArgs): Promise<T> {
    const data = {
      ...args.data,
      blockType: this.blockType
    } as BlockCreateInput;
    return this.blockService.create<T>({
      ...args,
      data
    });
  }
}
