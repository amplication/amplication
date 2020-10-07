import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DeployerOptions } from 'amplication-deployer/dist/deployer/Deployer';
import { DockerProviderService } from './dockerProvider.service';
import { GCPProviderService } from './gcpProvider.service';

export enum DeployerProvider {
  Docker = 'docker',
  GCP = 'gcp'
}

export const DEPLOYER_DEFAULT_VAR = 'DEPLOYER_DEFAULT';
export const UNDEFINED_DEPLOYER_DEFAULT_ERROR_MESSAGE = `${DEPLOYER_DEFAULT_VAR} environment variable must be defined`;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DeployerOptionsService extends DeployerOptions {}

@Injectable()
export class DeployerOptionsService implements DeployerOptions {
  constructor(
    configService: ConfigService,
    gcpProviderService: GCPProviderService,
    dockerProviderService: DockerProviderService
  ) {
    const deployerDefault = configService.get(DEPLOYER_DEFAULT_VAR);
    if (!deployerDefault) {
      throw new Error(UNDEFINED_DEPLOYER_DEFAULT_ERROR_MESSAGE);
    }
    Object.assign(this, {
      default: deployerDefault,
      providers: {
        [DeployerProvider.Docker]: dockerProviderService.getProvider(),
        [DeployerProvider.GCP]: gcpProviderService.getProvider()
      }
    });
  }
}
