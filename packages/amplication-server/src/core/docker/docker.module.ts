import { DockerService } from "./docker.service";
import { Module } from "@nestjs/common";

@Module({
  providers: [DockerService],
  exports: [DockerService],
})
export class DockerModule {}
