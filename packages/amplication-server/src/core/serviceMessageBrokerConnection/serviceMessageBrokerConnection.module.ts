import { Module } from '@nestjs/common';
import { ServiceMessageBrokerConnectionService } from './serviceMessageBrokerConnection.service';
import { ServiceMessageBrokerConnectionResolver } from './serviceMessageBrokerConnection.resolver';
import { BlockModule } from '../block/block.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { ResourceModule } from '../resource/resource.module';

@Module({
  imports: [BlockModule, PermissionsModule, ResourceModule],
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
