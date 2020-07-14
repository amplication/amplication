import { Resolver } from '@nestjs/graphql';
import { ConnectorRestApiCallService } from './connectorRestApiCall.service';
import {
  ConnectorRestApiCall,
  FindManyConnectorRestApiCallArgs,
  CreateConnectorRestApiCallArgs
} from './dto/';
import { BlockTypeResolver } from '../block/blockType.resolver';
import { UpdateBlockArgs } from '../block/dto/UpdateBlockArgs';

@Resolver(() => ConnectorRestApiCall)
export class ConnectorRestApiCallResolver extends BlockTypeResolver(
  ConnectorRestApiCall,
  'ConnectorRestApiCalls',
  FindManyConnectorRestApiCallArgs,
  'createConnectorRestApiCall',
  CreateConnectorRestApiCallArgs,
  'updateConnectorRestApiCall',
  UpdateBlockArgs
) {
  constructor(private readonly service: ConnectorRestApiCallService) {
    super();
  }
}
