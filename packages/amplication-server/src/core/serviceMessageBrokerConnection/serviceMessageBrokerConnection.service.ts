import { Injectable } from '@nestjs/common';
import { EnumBlockType } from 'src/enums/EnumBlockType';
import { BlockTypeService } from '../block/blockType.service';
import { CreateServiceMessageBrokerConnectionArgs } from './dto/CreateServiceMessageBrokerConnectionArgs';
import { FindManyServiceMessageBrokerConnectionArgs } from './dto/FindManyServiceMessageBrokerConnectionArgs';
import { ServiceMessageBrokerConnection } from './dto/ServiceMessageBrokerConnection';
import { UpdateServiceMessageBrokerConnectionArgs } from './dto/UpdateServiceMessageBrokerConnectionArgs';

@Injectable()
export class ServiceMessageBrokerConnectionService extends BlockTypeService<
  ServiceMessageBrokerConnection,
  FindManyServiceMessageBrokerConnectionArgs,
  CreateServiceMessageBrokerConnectionArgs,
  UpdateServiceMessageBrokerConnectionArgs
> {
  blockType = EnumBlockType.ServiceMessageBrokerConnection;

  constructor() {
    super();
  }
}
