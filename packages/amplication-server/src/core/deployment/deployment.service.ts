import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'nestjs-prisma';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import * as winston from 'winston';
import { DeployerService } from 'amplication-deployer/dist/nestjs';
import { BackgroundService } from '../background/background.service';
import { EnumActionStepStatus } from '../action/dto/EnumActionStepStatus';
import { EnumActionLogLevel } from '../action/dto/EnumActionLogLevel';
import { ActionService } from '../action/action.service';
import { Deployment } from './dto/Deployment';
import { CreateDeploymentArgs } from './dto/CreateDeploymentArgs';
import { FindManyDeploymentArgs } from './dto/FindManyDeploymentArgs';
import { EnumDeploymentStatus } from './dto/EnumDeploymentStatus';
import { FindOneDeploymentArgs } from './dto/FindOneDeploymentArgs';
import { CreateDeploymentDTO } from './dto/CreateDeploymentDTO';
import gcpDeployConfiguration from './gcp.deploy-configuration.json';

export const PUBLISH_APPS_PATH = '/deployments/';
export const DEPLOY_STEP_MESSAGE = 'Deploy app';
export const APPS_GCP_PROJECT_ID_VAR = 'APPS_GCP_PROJECT_ID';
export const APPS_GCP_REGION_VAR = 'APPS_GCP_REGION';
export const APPS_GCP_TERRAFORM_STATE_BUCKET_VAR =
  'GCP_DEPLOY_TERRAFORM_STATE_BUCKET';
export const APPS_GCP_DATABASE_INSTANCE_VAR = 'APPS_GCP_DATABASE_INSTANCE';
export const GCP_TERRAFORM_PROJECT_VARIABLE = 'project';
export const GCP_TERRAFORM_REGION_VARIABLE = 'region';
export const GCP_TERRAFORM_APP_ID_VARIABLE = 'app_id';
export const GCP_TERRAFORM_IMAGE_ID_VARIABLE = 'image_id';
export const GCP_TERRAFORM_DATABASE_INSTANCE_NAME_VARIABLE =
  'database_instance';

export function createInitialStepData(
  version: string,
  message: string,
  environment: string
) {
  return {
    message: 'Adding task to queue',
    status: EnumActionStepStatus.Success,
    completedAt: new Date(),
    logs: {
      create: [
        {
          level: EnumActionLogLevel.Info,
          message: 'Create deployment task',
          meta: {}
        },
        {
          level: EnumActionLogLevel.Info,
          message: `Deploy to environment: ${environment}`,
          meta: {}
        },
        {
          level: EnumActionLogLevel.Info,
          message: `version: ${version}`,
          meta: {}
        },
        {
          level: EnumActionLogLevel.Info,
          message: `message: ${message}`,
          meta: {}
        }
      ]
    }
  };
}

@Injectable()
export class DeploymentService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly deployerService: DeployerService,
    private readonly backgroundService: BackgroundService,
    private readonly actionService: ActionService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: winston.Logger
  ) {}

  async create(args: CreateDeploymentArgs): Promise<Deployment> {
    /**@todo: add validations */
    const deployment = await this.prisma.deployment.create({
      data: {
        ...args.data,
        status: EnumDeploymentStatus.Waiting,
        createdAt: new Date(),
        // Create action record
        action: {
          create: {
            steps: {
              create: createInitialStepData(
                /** @todo replace with version number */
                args.data.build.connect.id,
                args.data.message,
                /** @todo replace with environment name */
                args.data.environment.connect.id
              )
            }
          }
        }
      }
    });

    const createDeploymentDTO: CreateDeploymentDTO = {
      deploymentId: deployment.id
    };

    // Queue background task and don't wait
    this.backgroundService
      .queue(PUBLISH_APPS_PATH, createDeploymentDTO)
      .catch(this.logger.error);

    return deployment;
  }

  async findMany(args: FindManyDeploymentArgs): Promise<Deployment[]> {
    return this.prisma.deployment.findMany(args);
  }

  async findOne(args: FindOneDeploymentArgs): Promise<Deployment | null> {
    return this.prisma.deployment.findOne(args);
  }

  async deploy(deploymentId: string): Promise<void> {
    const deployment = await this.prisma.deployment.findOne({
      where: { id: deploymentId },
      include: { build: true }
    });
    await this.actionService.run(
      deployment.actionId,
      DEPLOY_STEP_MESSAGE,
      async () => {
        const { build } = deployment;
        const { appId } = build;
        const projectId = this.configService.get(APPS_GCP_PROJECT_ID_VAR);
        const terraformStateBucket = this.configService.get(
          APPS_GCP_TERRAFORM_STATE_BUCKET_VAR
        );
        const region = this.configService.get(APPS_GCP_REGION_VAR);
        const databaseInstance = this.configService.get(
          APPS_GCP_DATABASE_INSTANCE_VAR
        );
        const [imageId] = build.images;
        const backendConfiguration = {
          bucket: terraformStateBucket,
          prefix: appId
        };
        const variables = {
          [GCP_TERRAFORM_PROJECT_VARIABLE]: projectId,
          [GCP_TERRAFORM_REGION_VARIABLE]: region,
          [GCP_TERRAFORM_APP_ID_VARIABLE]: appId,
          [GCP_TERRAFORM_IMAGE_ID_VARIABLE]: imageId,
          [GCP_TERRAFORM_DATABASE_INSTANCE_NAME_VARIABLE]: databaseInstance
        };
        await this.deployerService.deploy(
          gcpDeployConfiguration,
          variables,
          backendConfiguration
        );
      }
    );
  }
}
