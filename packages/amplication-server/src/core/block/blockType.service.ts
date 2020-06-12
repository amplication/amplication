import { Injectable, Inject } from '@nestjs/common';
import { FindOneWithVersionArgs } from 'src/dto';
import { IBlock } from 'src/models';
import { EnumBlockType } from 'src/enums/EnumBlockType';
import { BlockService } from '../block/block.service';
import { CreateBlockArgs, FindManyBlockArgs } from '../block/dto';

@Injectable()
export abstract class BlockTypeService<
  T extends IBlock,
  CreateArgs extends CreateBlockArgs,
  FindManyArgs extends FindManyBlockArgs
> {
  abstract blockType: EnumBlockType;

  @Inject()
  private readonly blockService: BlockService;

  async create(args: CreateArgs): Promise<T> {
    return this.blockService.create<T>({
      data: {
        ...args.data,
        blockType: this.blockType
      }
    });
  }

  async findOne(args: FindOneWithVersionArgs): Promise<T | null> {
    return this.blockService.findOne<T>(args);
  }

  async findMany(args: FindManyArgs): Promise<T[]> {
    return this.blockService.findManyByBlockType(args, this.blockType);
  }
}
