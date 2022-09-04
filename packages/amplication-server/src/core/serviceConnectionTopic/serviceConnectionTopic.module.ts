import { Module } from '@nestjs/common';
import { ServiceConnectionTopicService } from './serviceConnectionTopic.service';
import { ServiceConnectionTopicResolver } from './serviceConnectionTopic.resolver';
import { BlockModule } from '../block/block.module';
import { PermissionsModule } from '../permissions/permissions.module';

@Module({
  imports: [BlockModule, PermissionsModule],
  providers: [ServiceConnectionTopicService, ServiceConnectionTopicResolver],
  exports: [ServiceConnectionTopicService, ServiceConnectionTopicResolver]
})
export class ServiceConnectionTopicModule {}
