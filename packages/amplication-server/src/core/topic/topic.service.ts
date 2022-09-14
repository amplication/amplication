import { Injectable } from '@nestjs/common';
import { EnumBlockType } from '../../enums/EnumBlockType';
import { BlockService } from '../block/block.service';
import { BlockTypeService } from '../block/blockType.service';
import { CreateTopicArgs } from './dto/CreateTopicArgs';
import { FindManyTopicArgs } from './dto/FindManyTopicArgs';
import { Topic } from './dto/Topic';
import { UpdateTopicArgs } from './dto/UpdateTopicArgs';

@Injectable()
export class TopicService extends BlockTypeService<
  Topic,
  FindManyTopicArgs,
  CreateTopicArgs,
  UpdateTopicArgs
> {
  blockType = EnumBlockType.Topic;

  constructor(protected readonly blockService: BlockService) {
    super(blockService);
  }
}
