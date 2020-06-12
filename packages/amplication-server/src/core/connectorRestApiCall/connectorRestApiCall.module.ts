import { Module } from '@nestjs/common';
import { ConnectorRestApiCallService } from './connectorRestApiCall.service';
import { ConnectorRestApiCallResolver } from './connectorRestApiCall.resolver';
import { BlockModule } from '../block/block.module';

@Module({
  imports: [BlockModule],
  providers: [ConnectorRestApiCallService, ConnectorRestApiCallResolver],
  exports: [ConnectorRestApiCallService, ConnectorRestApiCallResolver]
})
export class ConnectorRestApiCallModule {}
