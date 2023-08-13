import { KafkaModule } from "@amplication/util/nestjs/kafka";
import { Module } from "@nestjs/common";
import { BuildRunnerController } from "./build-runner.controller";
import { BuildRunnerService } from "./build-runner.service";

@Module({
  imports: [KafkaModule],
  controllers: [BuildRunnerController],
  providers: [BuildRunnerService],
})
export class BuildRunnerModule {}
