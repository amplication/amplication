import { BlockModule } from "../block/block.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { ServiceTopicsModule } from "../serviceTopics/serviceTopics.module";
import { UserModule } from "../user/user.module";
import { TopicResolver } from "./topic.resolver";
import { TopicService } from "./topic.service";
import { Module } from "@nestjs/common";
@Module({
  imports: [UserModule, BlockModule, PermissionsModule, ServiceTopicsModule],
  providers: [TopicService, TopicResolver],
  exports: [TopicService, TopicResolver],
})
export class TopicModule {}
