import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DockerBuildService } from './dockerBuild.service';

@Module({
  imports: [ConfigModule],
  providers: [DockerBuildService],
  exports: [DockerBuildService]
})
export class DockerBuildModule {}
