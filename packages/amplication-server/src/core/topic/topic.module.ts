import { Module } from "@nestjs/common";
import { TopicService } from "./topic.service";
import { TopicResolver } from "./topic.resolver";
import { BlockModule } from "../block/block.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { ServiceTopicsService } from "../serviceTopics/serviceTopics.service";
import { ServiceTopicsModule } from "../serviceTopics/serviceTopics.module";
import { ResourceModule } from "../resource/resource.module";

@Module({
  imports: [
    BlockModule,
    PermissionsModule,
    ServiceTopicsModule,
    ResourceModule,
  ],
  providers: [TopicService, TopicResolver, ServiceTopicsService],
  exports: [TopicService, TopicResolver, ServiceTopicsService],
})
export class TopicModule {}
