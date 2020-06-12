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

  async create(
    args: Omit<CreateArgs, 'data'> & {
      data: Omit<CreateArgs['data'], 'blockType'>;
    }
  ): Promise<T> {
    return this.blockService.create<T>({
      ...args,
      data: {
        ...args.data,
        blockType: this.blockType
      }
    } as CreateArgs);
  }

  async findOne(args: FindOneWithVersionArgs): Promise<T | null> {
    return this.blockService.findOne<T>(args);
  }

  async findMany(
    args: FindManyArgs & { where?: Omit<FindManyArgs['where'], 'blockType'> }
  ): Promise<T[]> {
    return this.blockService.findManyByBlockType(args, this.blockType);
  }
}
