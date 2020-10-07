import { Inject, Injectable, NotImplementedException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import * as winston from 'winston';
import { Deployment } from './dto/Deployment';
import { CreateDeploymentArgs } from './dto/CreateDeploymentArgs';
import { FindManyDeploymentArgs } from './dto/FindManyDeploymentArgs';
import { EnumDeploymentStatus } from './dto/EnumDeploymentStatus';
import { FindOneDeploymentArgs } from './dto/FindOneDeploymentArgs';
import { EnumActionStepStatus } from '../action/dto/EnumActionStepStatus';
import { EnumActionLogLevel } from '../action/dto/EnumActionLogLevel';
import { BackgroundService } from '../background/background.service';
import { CreateDeploymentDTO } from './dto/CreateDeploymentDTO';

export const PUBLISH_APPS_PATH = '/publish-apps/';

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
          message: 'create publish task',
          meta: {}
        },
        {
          level: EnumActionLogLevel.Info,
          message: `Publish to environment: ${environment}`,
          meta: {}
        },
        {
          level: EnumActionLogLevel.Info,
          message: `Publish version: ${version}`,
          meta: {}
        },
        {
          level: EnumActionLogLevel.Info,
          message: `Publish message: ${message}`,
          meta: {}
        }
      ]
    }
  };
}

@Injectable()
export class DeploymentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly backgroundService: BackgroundService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: winston.Logger
  ) {}

  async create(args: CreateDeploymentArgs): Promise<Deployment> {
    /**@todo: add validations */

    const deployment = await this.prisma.deployment.create({
      data: {
        ...args.data,
        status: EnumDeploymentStatus.Waiting,
        createdAt: new Date(),
        action: {
          create: {
            steps: {
              create: createInitialStepData(
                args.data.build.connect
                  .id /**@todo:replace with version number */,
                args.data.message,
                args.data.environment.connect
                  .id /**@todo:replace with environment name */
              )
            }
          } //create action record
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
    throw new NotImplementedException(deploymentId);
  }
}
