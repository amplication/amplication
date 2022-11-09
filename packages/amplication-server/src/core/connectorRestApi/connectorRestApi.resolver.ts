import { Resolver } from '@nestjs/graphql';
import { ConnectorRestApiService } from './connectorRestApi.service';
import {
  ConnectorRestApi,
  FindManyConnectorRestApiArgs,
  CreateConnectorRestApiArgs
} from './dto/';
import { BlockTypeResolver } from '../block/blockType.resolver';
import { UpdateBlockArgs } from '../block/dto/UpdateBlockArgs';
import { DeleteBlockArgs } from '../block/dto/DeleteBlockArgs';

@Resolver(() => ConnectorRestApi)
export class ConnectorRestApiResolver extends BlockTypeResolver(
  ConnectorRestApi,
  'ConnectorRestApis',
  FindManyConnectorRestApiArgs,
  'createConnectorRestApi',
  CreateConnectorRestApiArgs,
  'updateConnectorRestApi',
  UpdateBlockArgs,
  'deleteConnectorRestApi',
  DeleteBlockArgs
) {
  constructor(private readonly service: ConnectorRestApiService) {
    super();
  }
}
