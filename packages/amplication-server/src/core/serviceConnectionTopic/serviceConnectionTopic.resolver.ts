import { Resolver } from '@nestjs/graphql';
import { ServiceConnectionTopicService } from './serviceConnectionTopic.service';
import { FindManyServiceConnectionTopicArgs } from './dto/FindManyServiceConnectionTopicArgs';
import { BlockTypeResolver } from '../block/blockType.resolver';
import { ServiceConnectionTopic } from './dto/ServiceConnectionTopic';
import { CreateServiceConnectionTopicArgs } from './dto/CreateServiceConnectionTopicArgs';
import { UpdateServiceConnectionTopicArgs } from './dto/UpdateServiceConnectionTopicArgs';

@Resolver(() => ServiceConnectionTopic)
export class ServiceConnectionTopicResolver extends BlockTypeResolver(
  ServiceConnectionTopic,
  'ServiceConnectionTopics',
  FindManyServiceConnectionTopicArgs,
  'createServiceConnectionTopic',
  CreateServiceConnectionTopicArgs,
  'updateServiceConnectionTopic',
  UpdateServiceConnectionTopicArgs
) {
  constructor(private readonly service: ServiceConnectionTopicService) {
    super();
  }
}
