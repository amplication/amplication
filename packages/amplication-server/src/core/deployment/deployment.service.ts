import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'nestjs-prisma';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { differenceInSeconds } from 'date-fns';
import * as winston from 'winston';
import { DeploymentUpdateArgs } from '@prisma/client';
import { DeployResult, EnumDeployStatus } from 'amplication-deployer';
import { DeployerService } from 'amplication-deployer/dist/nestjs';
import { BackgroundService } from '../background/background.service';
import { EnumActionStepStatus } from '../action/dto/EnumActionStepStatus';
import { DeployerProvider } from '../deployer/deployerOptions.service';
import { EnumActionLogLevel } from '../action/dto/EnumActionLogLevel';
import { ActionService } from '../action/action.service';
import { ActionStep } from '../action/dto';
import * as domain from './domain.util';
import { Deployment } from './dto/Deployment';
import { CreateDeploymentArgs } from './dto/CreateDeploymentArgs';
import { FindManyDeploymentArgs } from './dto/FindManyDeploymentArgs';
import { EnumDeploymentStatus } from './dto/EnumDeploymentStatus';
import { FindOneDeploymentArgs } from './dto/FindOneDeploymentArgs';
import { CreateDeploymentDTO } from './dto/CreateDeploymentDTO';
import gcpDeployConfiguration from './gcp.deploy-configuration.json';
import { Build } from '../build/dto/Build';
import { Environment } from '../environment/dto';

export const PUBLISH_APPS_PATH = '/deployments/';
export const DEPLOY_STEP_NAME = 'Deploy app';
export const DEPLOY_STEP_MESSAGE = 'Deploy app';

export const DEPLOYER_DEFAULT_VAR = 'DEPLOYER_DEFAULT';

export const GCP_APPS_PROJECT_ID_VAR = 'GCP_APPS_PROJECT_ID';
export const GCP_APPS_REGION_VAR = 'GCP_APPS_REGION';
export const GCP_APPS_TERRAFORM_STATE_BUCKET_VAR =
  'GCP_APPS_TERRAFORM_STATE_BUCKET';
export const GCP_APPS_DATABASE_INSTANCE_VAR = 'GCP_APPS_DATABASE_INSTANCE';
export const GCP_APPS_DOMAIN_VAR = 'GCP_APPS_DOMAIN';

export const TERRAFORM_APP_ID_VARIABLE = 'app_id';
export const TERRAFORM_IMAGE_ID_VARIABLE = 'image_id';

export const GCP_TERRAFORM_PROJECT_VARIABLE = 'project';
export const GCP_TERRAFORM_REGION_VARIABLE = 'region';
export const GCP_TERRAFORM_DATABASE_INSTANCE_NAME_VARIABLE =
  'database_instance';
export const GCP_TERRAFORM_DOMAIN_VARIABLE = 'domain';
export const DEPLOY_DEPLOYMENT_INCLUDE = { build: true, environment: true };

export const DEPLOY_STEP_FINISH_LOG = 'The deployment completed successfully';
export const DEPLOY_STEP_FAILED_LOG = 'The deployment failed';
export const DEPLOY_STEP_RUNNING_LOG = 'Waiting for deployment to complete...';
export const DEPLOY_STEP_START_LOG =
  'Starting deployment. It may take a few minutes.';

const DEPLOY_STATUS_FETCH_INTERVAL_SEC = 10;
const DEPLOY_STATUS_UPDATE_INTERVAL_SEC = 30;

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
    const deployment = (await this.prisma.deployment.create({
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
    })) as Deployment;

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
    return this.prisma.deployment.findMany(args) as Promise<Deployment[]>;
  }

  async findOne(args: FindOneDeploymentArgs): Promise<Deployment | null> {
    return this.prisma.deployment.findOne(args) as Promise<Deployment>;
  }

  async getUpdatedStatus(
    deployment: Deployment
  ): Promise<EnumDeploymentStatus> {
    if (
      deployment.status === EnumDeploymentStatus.Waiting &&
      deployment.statusQuery &&
      differenceInSeconds(new Date(), deployment.statusUpdatedAt) >
        DEPLOY_STATUS_FETCH_INTERVAL_SEC
    ) {
      const steps = await this.actionService.getSteps(deployment.actionId);
      const deployStep = steps.find(step => step.name === DEPLOY_STEP_NAME);

      if (!deployStep) {
        throw new Error(
          `Action step with name '${DEPLOY_STEP_NAME}' is missing for the deployment`
        );
      }

      try {
        const result = await this.deployerService.getStatus(
          deployment.statusQuery
        );
        //To avoid too many messages in the log, if the status is still "running" handle the results only if the bigger interval passed
        if (
          result.status !== EnumDeployStatus.Running ||
          differenceInSeconds(new Date(), deployment.statusUpdatedAt) >
            DEPLOY_STATUS_UPDATE_INTERVAL_SEC
        ) {
          this.logger.info(
            `Deployment ${deployment.id}: current status ${result.status}`
          );
          const updatedDeployment = await this.handleDeployResult(
            deployment,
            deployStep,
            result
          );
          return updatedDeployment.status;
        } else {
          return deployment.status;
        }
      } catch (error) {
        await this.actionService.logInfo(deployStep, error);
        await this.actionService.complete(
          deployStep,
          EnumActionStepStatus.Failed
        );
        const status = EnumDeploymentStatus.Failed;
        await this.updateStatus(deployment.id, status);
        return status;
      }
    }
    return deployment.status; //return the deployment as is
  }

  async deploy(deploymentId: string): Promise<void> {
    const deployment = (await this.prisma.deployment.findOne({
      where: { id: deploymentId },
      include: DEPLOY_DEPLOYMENT_INCLUDE
    })) as Deployment & { build: Build; environment: Environment };
    await this.actionService.run(
      deployment.actionId,
      DEPLOY_STEP_NAME,
      DEPLOY_STEP_MESSAGE,
      async step => {
        const { build, environment } = deployment;
        const { appId } = build;
        const [imageId] = build.images;
        const deployerDefault = this.configService.get(DEPLOYER_DEFAULT_VAR);
        switch (deployerDefault) {
          case DeployerProvider.Docker: {
            throw new Error('Not implemented');
          }
          case DeployerProvider.GCP: {
            const result = await this.deployToGCP(
              appId,
              imageId,
              environment.address
            );
            await this.handleDeployResult(deployment, step, result);
            return;
          }
          default: {
            throw new Error(`Unknown deployment provider ${deployerDefault}`);
          }
        }
      },
      true
    );
  }

  private async handleDeployResult(
    deployment: Deployment,
    step: ActionStep,
    result: DeployResult
  ): Promise<Deployment> {
    switch (result.status) {
      case EnumDeployStatus.Completed:
        await this.actionService.logInfo(step, DEPLOY_STEP_FINISH_LOG);
        await this.actionService.complete(step, EnumActionStepStatus.Success);

        //mark previous deployments as removed
        const [prevDeployment] = await this.prisma.deployment.findMany({
          where: {
            environmentId: deployment.environmentId
          }
        });

        if (prevDeployment) {
          await this.updateStatus(
            prevDeployment.id,
            EnumDeploymentStatus.Removed
          );
        }
        return this.updateStatus(deployment.id, EnumDeploymentStatus.Completed);

      case EnumDeployStatus.Failed:
        await this.actionService.logInfo(step, DEPLOY_STEP_FAILED_LOG);
        await this.actionService.complete(step, EnumActionStepStatus.Failed);
        return this.updateStatus(deployment.id, EnumDeploymentStatus.Failed);
      default:
        await this.actionService.logInfo(step, DEPLOY_STEP_RUNNING_LOG);
        return this.update({
          where: { id: deployment.id },
          data: {
            statusQuery: result.statusQuery,
            statusUpdatedAt: new Date(),
            status: EnumDeploymentStatus.Waiting
          }
        });
    }
  }

  private async update(args: DeploymentUpdateArgs): Promise<Deployment> {
    return this.prisma.deployment.update(args) as Promise<Deployment>;
  }

  private async updateStatus(
    deploymentId: string,
    status: EnumDeploymentStatus
  ): Promise<Deployment> {
    return this.update({
      where: { id: deploymentId },
      data: { status }
    });
  }

  async deployToGCP(
    appId: string,
    imageId: string,
    subdomain: string
  ): Promise<DeployResult> {
    const projectId = this.configService.get(GCP_APPS_PROJECT_ID_VAR);
    const terraformStateBucket = this.configService.get(
      GCP_APPS_TERRAFORM_STATE_BUCKET_VAR
    );
    const region = this.configService.get(GCP_APPS_REGION_VAR);
    const databaseInstance = this.configService.get(
      GCP_APPS_DATABASE_INSTANCE_VAR
    );
    const appsDomain = this.configService.get(GCP_APPS_DOMAIN_VAR);
    const deploymentDomain = domain.join([subdomain, appsDomain]);

    const backendConfiguration = {
      bucket: terraformStateBucket,
      prefix: appId
    };
    const variables = {
      [TERRAFORM_APP_ID_VARIABLE]: appId,
      [TERRAFORM_IMAGE_ID_VARIABLE]: imageId,
      [GCP_TERRAFORM_PROJECT_VARIABLE]: projectId,
      [GCP_TERRAFORM_REGION_VARIABLE]: region,
      [GCP_TERRAFORM_DATABASE_INSTANCE_NAME_VARIABLE]: databaseInstance,
      [GCP_TERRAFORM_DOMAIN_VARIABLE]: deploymentDomain
    };
    return this.deployerService.deploy(
      gcpDeployConfiguration,
      variables,
      backendConfiguration,
      DeployerProvider.GCP
    );
  }
}
