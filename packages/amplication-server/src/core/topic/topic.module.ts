import { Module } from "@nestjs/common";
import { TopicService } from "./topic.service";
import { TopicResolver } from "./topic.resolver";
import { BlockModule } from "../block/block.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { ServiceTopicsModule } from "../serviceTopics/serviceTopics.module";
import { UserModule } from "../user/user.module";
@Module({
  imports: [UserModule, BlockModule, PermissionsModule, ServiceTopicsModule],
  providers: [TopicService, TopicResolver],
  exports: [TopicService, TopicResolver],
})
export class TopicModule {}
