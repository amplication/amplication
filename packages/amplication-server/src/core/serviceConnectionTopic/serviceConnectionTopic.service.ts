import { Injectable } from '@nestjs/common';
import { EnumBlockType } from 'src/enums/EnumBlockType';
import { BlockService } from '../block/block.service';
import { BlockTypeService } from '../block/blockType.service';
import { CreateServiceConnectionTopicArgs } from './dto/CreateServiceConnectionTopicArgs';
import { FindManyServiceConnectionTopicArgs } from './dto/FindManyServiceConnectionTopicArgs';
import { ServiceConnectionTopic } from './dto/ServiceConnectionTopic';
import { UpdateServiceConnectionTopicArgs } from './dto/UpdateServiceConnectionTopicArgs';

@Injectable()
export class ServiceConnectionTopicService extends BlockTypeService<
  ServiceConnectionTopic,
  FindManyServiceConnectionTopicArgs,
  CreateServiceConnectionTopicArgs,
  UpdateServiceConnectionTopicArgs
> {
  blockType = EnumBlockType.ServiceConnectionTopic;

  constructor(protected readonly blockService: BlockService) {
    super(blockService);
  }
}
