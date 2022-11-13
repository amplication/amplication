import { Resolver } from '@nestjs/graphql';
import { TopicService } from './topic.service';
import { FindManyTopicArgs } from './dto/FindManyTopicArgs';
import { BlockTypeResolver } from '../block/blockType.resolver';
import { Topic } from './dto/Topic';
import { CreateTopicArgs } from './dto/CreateTopicArgs';
import { UpdateTopicArgs } from './dto/UpdateTopicArgs';

@Resolver(() => Topic)
export class TopicResolver extends BlockTypeResolver(
  Topic,
  'Topics',
  FindManyTopicArgs,
  'createTopic',
  CreateTopicArgs,
  'updateTopic',
  UpdateTopicArgs
) {
  constructor(private readonly service: TopicService) {
    super();
  }
}
