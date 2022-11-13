import { Module } from '@nestjs/common';
import { DockerService } from './docker.service';

@Module({
  providers: [DockerService],
  exports: [DockerService]
})
export class DockerModule {}
