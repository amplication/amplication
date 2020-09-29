import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CloudBuildService } from './cloudBuild.service';
import { DockerBuildService } from './dockerBuild.service';

@Module({
  imports: [ConfigModule],
  providers: [DockerBuildService, CloudBuildService],
  exports: [DockerBuildService]
})
export class DockerBuildModule {}
