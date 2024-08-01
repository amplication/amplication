import { KafkaModule } from "@amplication/util/nestjs/kafka";
import { Module } from "@nestjs/common";
import { PackageRunnerController } from "./package-runner.controller";
import { PackageRunnerService } from "./package-runner.service";

@Module({
  imports: [KafkaModule],
  controllers: [PackageRunnerController],
  providers: [PackageRunnerService],
})
export class BuildRunnerModule {}
