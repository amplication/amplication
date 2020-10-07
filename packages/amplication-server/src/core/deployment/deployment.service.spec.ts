import { Test, TestingModule } from '@nestjs/testing';
import {
  DeploymentService,
  createInitialStepData,
  PUBLISH_APPS_PATH
} from './deployment.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

import { PrismaService } from 'nestjs-prisma';
import { EnumDeploymentStatus } from '@prisma/client';
import { BackgroundService } from '../background/background.service';
import { FindOneDeploymentArgs } from './dto/FindOneDeploymentArgs';
import { CreateDeploymentDTO } from './dto/CreateDeploymentDTO';
import { CreateDeploymentArgs } from './dto/CreateDeploymentArgs';
import { Deployment } from './dto/Deployment';

jest.mock('winston');

const EXAMPLE_DEPLOYMENT_ID = 'ExampleDeploymentId';
const EXAMPLE_USER_ID = 'ExampleUserId';
const EXAMPLE_BUILD_ID = 'ExampleBuild';
const EXAMPLE_ENVIRONMENT_ID = 'ExampleEnvironmentId';
const EXAMPLE_ACTION_ID = 'ExampleActionId';

const EXAMPLE_DEPLOYMENT: Deployment = {
  id: EXAMPLE_DEPLOYMENT_ID,
  status: EnumDeploymentStatus.Waiting,
  createdAt: new Date(),
  userId: EXAMPLE_USER_ID,
  buildId: EXAMPLE_BUILD_ID,
  environmentId: EXAMPLE_ENVIRONMENT_ID,
  message: 'new build',
  actionId: EXAMPLE_ACTION_ID
};

const EXAMPLE_CREATE_DEPLOYMENT_DTO: CreateDeploymentDTO = {
  deploymentId: EXAMPLE_DEPLOYMENT_ID
};

const loggerErrorMock = jest.fn(error => {
  // Write the error to console so it will be visible for who runs the test
  console.error(error);
});
const loggerChildInfoMock = jest.fn();
const loggerChildErrorMock = jest.fn(error => {
  // Write the error to console so it will be visible for who runs the test
  console.error(error);
});
const loggerChildMock = jest.fn(() => ({
  info: loggerChildInfoMock,
  error: loggerChildErrorMock
}));
const EXAMPLE_LOGGER_FORMAT = Symbol('EXAMPLE_LOGGER_FORMAT');

const prismaCreateDeploymentMock = jest.fn(() => EXAMPLE_DEPLOYMENT);

const prismaFindOneDeploymentMock = jest.fn(() => EXAMPLE_DEPLOYMENT);

const prismaFindManyDeploymentMock = jest.fn(() => {
  return [EXAMPLE_DEPLOYMENT];
});

const backgroundServiceQueueMock = jest.fn(async () => {
  return;
});

describe('DeploymentService', () => {
  let service: DeploymentService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PrismaService,
          useValue: {
            deployment: {
              create: prismaCreateDeploymentMock,
              findMany: prismaFindManyDeploymentMock,
              findOne: prismaFindOneDeploymentMock
            }
          }
        },
        {
          provide: BackgroundService,
          useValue: {
            queue: backgroundServiceQueueMock
          }
        },
        {
          provide: WINSTON_MODULE_PROVIDER,
          useValue: {
            error: loggerErrorMock,
            child: loggerChildMock,
            format: EXAMPLE_LOGGER_FORMAT
          }
        },
        DeploymentService
      ]
    }).compile();

    service = module.get<DeploymentService>(DeploymentService);
  });

  test('should be defined', () => {
    expect(service).toBeDefined();
  });

  test('create deployment', async () => {
    const args: CreateDeploymentArgs = {
      data: {
        createdBy: {
          connect: {
            id: EXAMPLE_USER_ID
          }
        },
        build: {
          connect: {
            id: EXAMPLE_BUILD_ID
          }
        },
        environment: {
          connect: {
            id: EXAMPLE_ENVIRONMENT_ID
          }
        },
        message: EXAMPLE_DEPLOYMENT.message
      }
    };

    expect(await service.create(args)).toEqual(EXAMPLE_DEPLOYMENT);

    expect(prismaCreateDeploymentMock).toBeCalledTimes(1);
    expect(prismaCreateDeploymentMock).toBeCalledWith({
      data: {
        ...args.data,
        status: EnumDeploymentStatus.Waiting,
        createdAt: expect.any(Date),
        action: {
          create: {
            steps: {
              create: {
                ...createInitialStepData(
                  args.data.build.connect.id,
                  args.data.message,
                  args.data.environment.connect.id
                ),
                completedAt: expect.any(Date)
              }
            }
          }
        }
      }
    });
    expect(backgroundServiceQueueMock).toBeCalledTimes(1);
    expect(backgroundServiceQueueMock).toBeCalledWith(
      PUBLISH_APPS_PATH,
      EXAMPLE_CREATE_DEPLOYMENT_DTO
    );
  });

  test('find many deployments', async () => {
    const args = {};
    expect(await service.findMany(args)).toEqual([EXAMPLE_DEPLOYMENT]);
    expect(prismaFindManyDeploymentMock).toBeCalledTimes(1);
    expect(prismaFindManyDeploymentMock).toBeCalledWith(args);
  });

  test('find one deployment', async () => {
    const args: FindOneDeploymentArgs = {
      where: {
        id: EXAMPLE_DEPLOYMENT_ID
      }
    };
    expect(await service.findOne(args)).toEqual(EXAMPLE_DEPLOYMENT);
  });
});
