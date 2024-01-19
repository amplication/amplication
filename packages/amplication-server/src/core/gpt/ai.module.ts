import { ResourceModule } from "../resource/resource.module";
import { UserActionModule } from "../userAction/userAction.module";
import { AiController } from "./ai.controller";
import { AiService } from "./ai.service";
import { KafkaModule } from "@amplication/util/nestjs/kafka";
import { Module } from "@nestjs/common";

@Module({
  controllers: [AiController],
  imports: [KafkaModule, ResourceModule, UserActionModule],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
