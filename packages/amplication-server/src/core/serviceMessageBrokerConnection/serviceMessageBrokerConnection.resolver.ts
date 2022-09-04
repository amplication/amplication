import { Resolver } from '@nestjs/graphql';
import { ServiceMessageBrokerConnectionService } from './serviceMessageBrokerConnection.service';
import { FindManyServiceMessageBrokerConnectionArgs } from './dto/FindManyServiceMessageBrokerConnectionArgs';
import { BlockTypeResolver } from '../block/blockType.resolver';
import { ServiceMessageBrokerConnection } from './dto/ServiceMessageBrokerConnection';
import { CreateServiceMessageBrokerConnectionArgs } from './dto/CreateServiceMessageBrokerConnectionArgs';
import { UpdateServiceMessageBrokerConnectionArgs } from './dto/UpdateServiceMessageBrokerConnectionArgs';

@Resolver(() => ServiceMessageBrokerConnection)
export class ServiceMessageBrokerConnectionResolver extends BlockTypeResolver(
  ServiceMessageBrokerConnection,
  'ServiceMessageBrokerConnections',
  FindManyServiceMessageBrokerConnectionArgs,
  'createServiceMessageBrokerConnection',
  CreateServiceMessageBrokerConnectionArgs,
  'updateServiceMessageBrokerConnection',
  UpdateServiceMessageBrokerConnectionArgs
) {
  constructor(private readonly service: ServiceMessageBrokerConnectionService) {
    super();
  }
}
