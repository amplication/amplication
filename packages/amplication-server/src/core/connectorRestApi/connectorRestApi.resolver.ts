import { Resolver } from '@nestjs/graphql';
import { ConnectorRestApiService } from './connectorRestApi.service';
import {
  ConnectorRestApi,
  FindManyConnectorRestApiArgs,
  CreateConnectorRestApiArgs
} from './dto/';
import { BlockTypeResolver } from '../block/blockType.resolver';

@Resolver(() => ConnectorRestApi)
export class ConnectorRestApiResolver extends BlockTypeResolver(
  ConnectorRestApi,
  'ConnectorRestApis',
  FindManyConnectorRestApiArgs,
  'createConnectorRestApi',
  CreateConnectorRestApiArgs
) {
  constructor(private readonly service: ConnectorRestApiService) {
    super();
  }
}
