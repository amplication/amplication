import { Module } from '@nestjs/common';
import { ServiceTopicsService } from './serviceTopics.service';
import { ServiceTopicsResolver } from './serviceTopics.resolver';
import { BlockModule } from '../block/block.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { ResourceModule } from '../resource/resource.module';

@Module({
  imports: [BlockModule, PermissionsModule, ResourceModule],
  providers: [ServiceTopicsService, ServiceTopicsResolver],
  exports: [ServiceTopicsService, ServiceTopicsResolver]
})
export class ServiceTopicsModule {}
