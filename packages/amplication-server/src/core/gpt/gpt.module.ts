import { KafkaModule } from "@amplication/util/nestjs/kafka";
import { Module } from "@nestjs/common";
import { UserActionModule } from "../userAction/userAction.module";
import { GptController } from "./gpt.controller";
import { GptService } from "./gpt.service";

@Module({
  controllers: [GptController],
  imports: [KafkaModule, UserActionModule],
  providers: [GptService],
  exports: [GptService],
})
export class GptModule {}
