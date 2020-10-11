import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DeployerOptionsService } from './deployerOptions.service';
import { DockerProviderService } from './dockerProvider.service';
import { GCPProviderService } from './gcpProvider.service';

@Module({
  providers: [
    DeployerOptionsService,
    GCPProviderService,
    DockerProviderService
  ],
  imports: [ConfigModule],
  exports: [DeployerOptionsService, GCPProviderService, DockerProviderService]
})
export class DeployerOptionsModule {}
