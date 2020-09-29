import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CloudBuildService } from './cloudBuild.service';
import { DockerService } from './docker.service';
import { DockerBuildService } from './dockerBuild.service';

@Module({
  imports: [ConfigModule],
  providers: [DockerBuildService, CloudBuildService, DockerService],
  exports: [DockerBuildService]
})
export class DockerBuildModule {}
