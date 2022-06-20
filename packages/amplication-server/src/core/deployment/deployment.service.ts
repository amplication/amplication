import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService, Prisma } from '@amplication/prisma-db';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { subSeconds, differenceInSeconds, subDays } from 'date-fns';

import { isEmpty } from 'lodash';
import * as winston from 'winston';
import { DeployResult, EnumDeployStatus } from '@amplication/deployer';
import { DeployerService } from '@amplication/deployer/dist/nestjs';
import { EnvironmentService } from '../environment/environment.service';
import { EnumActionStepStatus } from '../action/dto/EnumActionStepStatus';
import { DeployerProvider } from '../deployer/deployerOptions.service';
import { EnumActionLogLevel } from '../action/dto/EnumActionLogLevel';
import { ActionService } from '../action/action.service';
import { ActionStep } from '../action/dto';
import * as domain from './domain.util';
import { Deployment } from './dto/Deployment';
import { CreateDeploymentArgs } from './dto/CreateDeploymentArgs';
import { EnumDeploymentStatus } from './dto/EnumDeploymentStatus';
import { FindOneDeploymentArgs } from './dto/FindOneDeploymentArgs';
import gcpDeployConfiguration from './gcp.deploy-configuration.json';
import { Build } from '../build/dto/Build';
import { Environment } from '../environment/dto';
import { MailService } from '../mail/mail.service';

export const PUBLISH_APPS_PATH = '/deployments/';
export const DEPLOY_STEP_NAME = 'DEPLOY_APP';
export const DEPLOY_STEP_MESSAGE = 'Deploy Application';

export const DESTROY_STEP_NAME = 'DESTROY_APP';
export const DESTROY_STEP_MESSAGE = 'Removing Deployment';
export const DESTROY_STEP_FINISH_LOG = 'The deployment removed successfully';

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

export const AUTO_DEPLOY_MESSAGE = 'Auto deploy to sandbox environment';
export const ACTION_INCLUDE = {
  action: {
    include: {
      steps: true
    }
  }
};

const MAX_DESTROY_PER_CYCLE = 2;
const DESTROY_STALED_INTERVAL_DAYS = 14;
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
  canDeploy: boolean;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly deployerService: DeployerService,
    private readonly actionService: ActionService,
    private readonly environmentService: EnvironmentService,
    private readonly mailService: MailService,

    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: winston.Logger
  ) {
    this.canDeploy = Boolean(this.deployerService.options.default);
  }

  async autoDeployToSandbox(build: Build): Promise<Deployment> {
    const sandboxEnvironment = await this.environmentService.getDefaultEnvironment(
      build.appId
    );

    const deployment = (await this.prisma.deployment.create({
      data: {
        build: {
          connect: {
            id: build.id
          }
        },
        createdBy: {
          connect: {
            id: build.userId
          }
        },
        environment: {
          connect: {
            id: sandboxEnvironment.id
          }
        },
        message: AUTO_DEPLOY_MESSAGE,
        status: EnumDeploymentStatus.Waiting,
        createdAt: new Date(),
        action: {
          connect: {
            id: build.actionId
          }
        }
      }
    })) as Deployment;

    await this.deploy(deployment.id);

    return deployment;
  }

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

    await this.deploy(deployment.id);

    return deployment;
  }

  async findMany(args: Prisma.DeploymentFindManyArgs): Promise<Deployment[]> {
    return this.prisma.deployment.findMany(args) as Promise<Deployment[]>;
  }

  async findOne(args: FindOneDeploymentArgs): Promise<Deployment | null> {
    return this.prisma.deployment.findUnique(args) as Promise<Deployment>;
  }

  /**
   * Gets the updated status of running deployments from
   * DeployerService, and updates the step and deployment status. This function should
   * be called periodically from an external scheduler
   */
  async updateRunningDeploymentsStatus(): Promise<void> {
    const lastUpdateThreshold = subSeconds(
      new Date(),
      DEPLOY_STATUS_FETCH_INTERVAL_SEC
    );

    //find all deployments that are still running
    const deployments = await this.findMany({
      where: {
        statusUpdatedAt: {
          lt: lastUpdateThreshold
        },
        status: {
          equals: EnumDeploymentStatus.Waiting
        }
      },
      include: ACTION_INCLUDE
    });
    await Promise.all(
      deployments.map(async deployment => {
        const steps = await this.actionService.getSteps(deployment.actionId);
        const deployStep = steps.find(step => step.name === DEPLOY_STEP_NAME);
        const destroyStep = steps.find(step => step.name === DESTROY_STEP_NAME);

        const currentStep = destroyStep || deployStep; //when destroy step exist it is the current one
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
              currentStep,
              result
            );
            return updatedDeployment.status;
          } else {
            return deployment.status;
          }
        } catch (error) {
          await this.actionService.logInfo(currentStep, error);
          await this.actionService.complete(
            currentStep,
            EnumActionStepStatus.Failed
          );
          const status = EnumDeploymentStatus.Failed;
          await this.updateStatus(deployment.id, status);
        }
      })
    );
  }

  async deploy(deploymentId: string): Promise<void> {
    const deployment = (await this.prisma.deployment.findUnique({
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
    const { email } = await this.prisma.user
      .findUnique({
        where: { id: deployment.userId }
      })
      .account();

    switch (result.status) {
      case EnumDeployStatus.Completed:
        if (step.name === DESTROY_STEP_NAME) {
          await this.actionService.logInfo(step, DESTROY_STEP_FINISH_LOG);
          await this.actionService.complete(step, EnumActionStepStatus.Success);

          return this.updateStatus(deployment.id, EnumDeploymentStatus.Removed);
        } else {
          await this.actionService.logInfo(step, DEPLOY_STEP_FINISH_LOG);
          await this.actionService.complete(step, EnumActionStepStatus.Success);

          if (isEmpty(result.url)) {
            await this.mailService.sendDeploymentNotification({
              to: email,
              url: result.url,
              success: false
            });
            throw new Error(
              `Deployment ${deployment.id} completed without a deployment URL`
            );
          }

          await this.mailService.sendDeploymentNotification({
            to: email,
            url: result.url,
            success: true
          });

          await this.prisma.environment.update({
            where: {
              id: deployment.environmentId
            },
            data: {
              address: result.url
            }
          });

          //mark previous active deployments as removed
          await this.prisma.deployment.updateMany({
            where: {
              environmentId: deployment.environmentId,
              status: EnumDeploymentStatus.Completed
            },
            data: {
              status: EnumDeploymentStatus.Removed
            }
          });

          return this.updateStatus(
            deployment.id,
            EnumDeploymentStatus.Completed
          );
        }

      case EnumDeployStatus.Failed:
        await this.actionService.logInfo(step, DEPLOY_STEP_FAILED_LOG);
        await this.actionService.complete(step, EnumActionStepStatus.Failed);
        await this.mailService.sendDeploymentNotification({
          to: email,
          url: result.url,
          success: false
        });
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

  private async update(args: Prisma.DeploymentUpdateArgs): Promise<Deployment> {
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

  /**
   * Destroy staled environments
   * This function should be called periodically from an external scheduler
   */
  async destroyStaledDeployments(): Promise<void> {
    const lastDeployThreshold = subDays(
      new Date(),
      DESTROY_STALED_INTERVAL_DAYS
    );

    const environments = await this.prisma.environment.findMany({
      where: {
        deployments: {
          some: {
            createdAt: {
              lt: lastDeployThreshold
            },
            status: {
              equals: EnumDeploymentStatus.Completed
            }
          }
        }
      },
      take: MAX_DESTROY_PER_CYCLE
    });
    await Promise.all(
      environments.map(async environment => {
        return this.destroy(environment.id);
      })
    );
  }

  async destroy(environmentId: string): Promise<void> {
    const deployment = (await this.prisma.deployment.findFirst({
      where: {
        environmentId: environmentId,
        status: EnumDeploymentStatus.Completed
      },
      orderBy: {
        createdAt: Prisma.SortOrder.desc
      },
      include: DEPLOY_DEPLOYMENT_INCLUDE
    })) as Deployment & { build: Build; environment: Environment };

    if (!deployment) return;
    await this.actionService.run(
      deployment.actionId,
      DESTROY_STEP_NAME,
      DESTROY_STEP_MESSAGE,
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
            await this.updateStatus(
              deployment.id,
              EnumDeploymentStatus.Waiting
            );

            const result = await this.destroyOnGCP(
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

  async destroyOnGCP(
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
    return this.deployerService.destroy(
      gcpDeployConfiguration,
      variables,
      backendConfiguration,
      DeployerProvider.GCP
    );
  }
}
