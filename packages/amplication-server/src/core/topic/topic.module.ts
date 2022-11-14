import { Module } from "@nestjs/common";
import { TopicService } from "./topic.service";
import { TopicResolver } from "./topic.resolver";
import { BlockModule } from "../block/block.module";
import { PermissionsModule } from "../permissions/permissions.module";

@Module({
  imports: [BlockModule, PermissionsModule],
  providers: [TopicService, TopicResolver],
  exports: [TopicService, TopicResolver],
})
export class TopicModule {}
