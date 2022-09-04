import { Module } from '@nestjs/common';
import { ServiceMessageBrokerConnectionService } from './serviceMessageBrokerConnection.service';
import { ServiceMessageBrokerConnectionResolver } from './serviceMessageBrokerConnection.resolver';
import { BlockModule } from '../block/block.module';
import { PermissionsModule } from '../permissions/permissions.module';

@Module({
  imports: [BlockModule, PermissionsModule],
  providers: [
    ServiceMessageBrokerConnectionService,
    ServiceMessageBrokerConnectionResolver
  ],
  exports: [
    ServiceMessageBrokerConnectionService,
    ServiceMessageBrokerConnectionResolver
  ]
})
export class ServiceMessageBrokerConnectionModule {}
