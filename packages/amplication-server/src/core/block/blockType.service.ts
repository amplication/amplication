import { Injectable, Inject } from '@nestjs/common';
import { FindOneWithVersionArgs } from 'src/dto';
import { IBlock } from 'src/models';
import { EnumBlockType } from 'src/enums/EnumBlockType';
import { BlockService } from '../block/block.service';
import {
  CreateBlockArgs,
  FindManyBlockArgs,
  BlockCreateInput
} from '../block/dto';

@Injectable()
export abstract class BlockTypeService<
  T extends IBlock,
  FindManyArgs extends FindManyBlockArgs,
  CreateArgs extends CreateBlockArgs
> {
  abstract blockType: EnumBlockType;

  @Inject()
  private readonly blockService: BlockService;

  async findOne(args: FindOneWithVersionArgs): Promise<T | null> {
    return this.blockService.findOne<T>(args);
  }

  async findMany(
    args: Omit<FindManyArgs, 'where'> & {
      where?: Omit<FindManyArgs['where'], 'blockType'>;
    }
  ): Promise<T[]> {
    return this.blockService.findManyByBlockType(args, this.blockType);
  }

  async create(
    args: Omit<CreateArgs, 'data'> & {
      data: Omit<CreateArgs['data'], 'blockType'>;
    }
  ): Promise<T> {
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
