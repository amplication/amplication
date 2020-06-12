import { Resolver } from '@nestjs/graphql';
import { ConnectorRestApiCallService } from './connectorRestApiCall.service';
import {
  ConnectorRestApiCall,
  FindManyConnectorRestApiCallArgs,
  CreateConnectorRestApiCallArgs
} from './dto/';
import { BlockTypeResolver } from '../block/blockType.resolver';

@Resolver(() => ConnectorRestApiCall)
export class ConnectorRestApiCallResolver extends BlockTypeResolver(
  ConnectorRestApiCall,
  'ConnectorRestApiCalls',
  FindManyConnectorRestApiCallArgs,
  'createConnectorRestApiCall',
  CreateConnectorRestApiCallArgs
) {
  constructor(private readonly service: ConnectorRestApiCallService) {
    super();
  }
}
