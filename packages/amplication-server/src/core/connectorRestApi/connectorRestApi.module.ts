import { Module } from '@nestjs/common';
import { ConnectorRestApiService } from './connectorRestApi.service';
import { ConnectorRestApiResolver } from './connectorRestApi.resolver';
import { PrismaModule } from 'src/services/prisma.module';
import { BlockModule } from '../block/block.module';

@Module({
  imports: [PrismaModule, BlockModule],
  providers: [ConnectorRestApiService, ConnectorRestApiResolver],
  exports: [ConnectorRestApiService, ConnectorRestApiResolver]
})
export class ConnectorRestApiModule {}
