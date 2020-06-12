import { Module } from '@nestjs/common';
import { ConnectorRestApiService } from './connectorRestApi.service';
import { ConnectorRestApiResolver } from './connectorRestApi.resolver';
import { BlockModule } from '../block/block.module';
import { PermissionsModule } from '../permissions/permissions.module';

@Module({
  imports: [BlockModule, PermissionsModule],
  providers: [ConnectorRestApiService, ConnectorRestApiResolver],
  exports: [ConnectorRestApiService, ConnectorRestApiResolver]
})
export class ConnectorRestApiModule {}
