import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'nestjs-prisma';
import { Build } from '@prisma/client';
import { DeployerService } from 'amplication-deployer/dist/nestjs';
import { DeployerProvider } from '../deployer/deployerOptions.service';
import { ActionService } from '../action/action.service';
import {
  DeploymentService,
  createInitialStepData,
  DEPLOY_STEP_MESSAGE,
  GCP_APPS_PROJECT_ID_VAR,
  GCP_APPS_REGION_VAR,
  GCP_APPS_TERRAFORM_STATE_BUCKET_VAR,
  GCP_APPS_DATABASE_INSTANCE_VAR,
  GCP_TERRAFORM_PROJECT_VARIABLE,
  GCP_TERRAFORM_REGION_VARIABLE,
  GCP_TERRAFORM_DOMAIN_VARIABLE,
  TERRAFORM_APP_ID_VARIABLE,
  TERRAFORM_IMAGE_ID_VARIABLE,
  GCP_TERRAFORM_DATABASE_INSTANCE_NAME_VARIABLE,
  DEPLOYER_DEFAULT_VAR,
  DEPLOY_STEP_NAME,
  DEPLOY_DEPLOYMENT_INCLUDE,
  GCP_APPS_DOMAIN_VAR,
  ACTION_INCLUDE
} from './deployment.service';
import * as domain from './domain.util';
import { FindOneDeploymentArgs } from './dto/FindOneDeploymentArgs';
import { CreateDeploymentArgs } from './dto/CreateDeploymentArgs';
import { Deployment } from './dto/Deployment';
import gcpDeployConfiguration from './gcp.deploy-configuration.json';
import { Environment } from '../environment/dto';
import { EnvironmentService } from '../environment/environment.service';

import { EnumDeploymentStatus } from './dto/EnumDeploymentStatus';
import { ActionStep, EnumActionStepStatus } from '../action/dto';
import {
  DeployResult,
  EnumDeployStatus
} from 'amplication-deployer/dist/types';

jest.mock('winston');

const EXAMPLE_DEPLOYMENT_ID = 'ExampleDeploymentId';
const EXAMPLE_COMMIT_ID = 'ExampleCommitId';

const EXAMPLE_USER_ID = 'ExampleUserId';
const EXAMPLE_BUILD_ID = 'ExampleBuild';
const EXAMPLE_ENVIRONMENT_ID = 'ExampleEnvironmentId';
const EXAMPLE_ACTION_ID = 'ExampleActionId';
const EXAMPLE_APP_ID = 'EXAMPLE_APP_ID';

const AUTO_DEPLOY_MESSAGE = 'Auto deploy to sandbox environment';

const EXAMPLE_NAME = 'exampleName';
const EXAMPLE_MESSAGE = 'exampleMessage';

const EXAMPLE_URL = 'exampleUrl';

const EXAMPLE_BUILD: Build = {
  id: EXAMPLE_BUILD_ID,
  images: ['EXAMPLE_BUILD_IMAGE_ID'],
  createdAt: new Date(),
  appId: EXAMPLE_APP_ID,
  userId: EXAMPLE_USER_ID,
  version: 'EXAMPLE_VERSION',
  message: 'EXAMPLE_BUILD_MESSAGE',
  actionId: EXAMPLE_ACTION_ID,
  containerStatusQuery: 'EXAMPLE_CONTAINER_STATUS_QUERY',
  containerStatusUpdatedAt: new Date(),
  commitId: EXAMPLE_COMMIT_ID
};

const EXAMPLE_ENVIRONMENT: Environment = {
  id: EXAMPLE_ENVIRONMENT_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  name: 'EXAMPLE_ENVIRONMENT_NAME',
  address: 'EXAMPLE_ADDRESS',
  appId: EXAMPLE_APP_ID
};

const EXAMPLE_DEPLOYMENT: Deployment = {
  id: EXAMPLE_DEPLOYMENT_ID,
  status: EnumDeploymentStatus.Waiting,
  createdAt: new Date(),
  userId: EXAMPLE_USER_ID,
  buildId: EXAMPLE_BUILD_ID,
  environmentId: EXAMPLE_ENVIRONMENT_ID,
  message: 'new build',
  actionId: EXAMPLE_ACTION_ID,
  build: EXAMPLE_BUILD,
  environment: EXAMPLE_ENVIRONMENT
};

const EXAMPLE_IMAGE_ID = 'EXAMPLE_IMAGE_ID';

const EXAMPLE_DEPLOYMENT_WITH_BUILD_AND_ENVIRONMENT: Deployment & {
  build: Build;
  environment: Environment;
} = {
  ...EXAMPLE_DEPLOYMENT,
  environment: EXAMPLE_ENVIRONMENT,
  build: {
    id: 'EXAMPLE_BUILD_ID',
    actionId: 'EXAMPLE_BUILD_ACTION_ID',
    createdAt: new Date(),
    message: 'EXAMPLE_BUILD_MESSAGE',
    status: EnumDeploymentStatus.Completed,
    userId: 'EXAMPLE_BUILD_USER_ID',
    version: 'EXAMPLE_BUILD_VERSION',
    appId: EXAMPLE_APP_ID,
    images: [EXAMPLE_IMAGE_ID],
    containerStatusQuery: null,
    containerStatusUpdatedAt: null,
    commitId: EXAMPLE_COMMIT_ID
  }
};

const EXAMPLE_ACTION_STEP: ActionStep = {
  id: EXAMPLE_ACTION_ID,
  createdAt: new Date(),
  name: EXAMPLE_NAME,
  message: EXAMPLE_MESSAGE,
  status: EnumActionStepStatus.Running
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

const prismaDeploymentCreateMock = jest.fn(() => EXAMPLE_DEPLOYMENT);

const prismaDeploymentUpdateMock = jest.fn(() => EXAMPLE_DEPLOYMENT);

const prismaDeploymentFindOneMock = jest.fn(() => EXAMPLE_DEPLOYMENT);

const prismaDeploymentFindManyMock = jest.fn(() => {
  return [EXAMPLE_DEPLOYMENT];
});

const actionServiceRunMock = jest.fn(
  (actionId, name, message, actionFunction) => actionFunction()
);
const actionServiceLogInfoMock = jest.fn();

const EXAMPLE_GCP_APPS_PROJECT_ID = 'EXAMPLE_GCP_APPS_PROJECT_ID';
const EXAMPLE_GCP_APPS_TERRAFORM_STATE_BUCKET =
  'EXAMPLE_GCP_APPS_TERRAFORM_STATE_BUCKET';
const EXAMPLE_GCP_APPS_REGION = 'EXAMPLE_GCP_APPS_REGION';
const EXAMPLE_GCP_APPS_DATABASE_INSTANCE = 'EXAMPLE_GCP_APPS_DATABASE_INSTANCE';
const EXAMPLE_GCP_APPS_DOMAIN = 'EXAMPLE_GCP_APPS_DOMAIN';
const EXAMPLE_DEPLOY_RESULT = {};
const EXAMPLE_COMPLETED_DEPLOY_RESULT: DeployResult = {
  statusQuery: {},
  status: EnumDeployStatus.Completed,
  url: EXAMPLE_URL
};

const configServiceGetMock = jest.fn(name => {
  switch (name) {
    case GCP_APPS_PROJECT_ID_VAR:
      return EXAMPLE_GCP_APPS_PROJECT_ID;
    case GCP_APPS_TERRAFORM_STATE_BUCKET_VAR:
      return EXAMPLE_GCP_APPS_TERRAFORM_STATE_BUCKET;
    case GCP_APPS_REGION_VAR:
      return EXAMPLE_GCP_APPS_REGION;
    case GCP_APPS_DATABASE_INSTANCE_VAR:
      return EXAMPLE_GCP_APPS_DATABASE_INSTANCE;
    case DEPLOYER_DEFAULT_VAR:
      return DeployerProvider.GCP;
    case GCP_APPS_DOMAIN_VAR:
      return EXAMPLE_GCP_APPS_DOMAIN;
  }
});

const environmentServiceGetDefaultEnvironmentMock = jest.fn(
  () => EXAMPLE_ENVIRONMENT
);

const deployerServiceDeploy = jest.fn(() => EXAMPLE_DEPLOY_RESULT);

const actionServiceGetStepsMock = jest.fn(() => [EXAMPLE_ACTION_STEP]);
const actionServiceCompleteMock = jest.fn(() => ({}));
const deployerServiceGetStatusMock = jest.fn(
  () => EXAMPLE_COMPLETED_DEPLOY_RESULT
);

const loggerInfoMock = jest.fn(() => ({}));

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
              create: prismaDeploymentCreateMock,
              findMany: prismaDeploymentFindManyMock,
              findOne: prismaDeploymentFindOneMock,
              update: prismaDeploymentUpdateMock
            }
          }
        },
        {
          provide: WINSTON_MODULE_PROVIDER,
          useValue: {
            error: loggerErrorMock,
            child: loggerChildMock,
            format: EXAMPLE_LOGGER_FORMAT,
            info: loggerInfoMock
          }
        },
        {
          provide: ActionService,
          useValue: {
            run: actionServiceRunMock,
            logInfo: actionServiceLogInfoMock,
            getSteps: actionServiceGetStepsMock,
            complete: actionServiceCompleteMock
          }
        },
        {
          provide: EnvironmentService,
          useValue: {
            getDefaultEnvironment: environmentServiceGetDefaultEnvironmentMock
          }
        },
        {
          provide: ConfigService,
          useValue: {
            get: configServiceGetMock
          }
        },
        {
          provide: DeployerService,
          useValue: {
            deploy: deployerServiceDeploy,
            options: {
              default: 'EXAMPLE_DEFAULT_PROVIDER'
            },
            getStatus: deployerServiceGetStatusMock
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

  test('creates a deployment', async () => {
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

    expect(prismaDeploymentCreateMock).toBeCalledTimes(1);
    expect(prismaDeploymentCreateMock).toBeCalledWith({
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
  });

  test('finds many deployments', async () => {
    const args = {};
    expect(await service.findMany(args)).toEqual([EXAMPLE_DEPLOYMENT]);
    expect(prismaDeploymentFindManyMock).toBeCalledTimes(1);
    expect(prismaDeploymentFindManyMock).toBeCalledWith(args);
  });

  test('finds one deployment', async () => {
    const args: FindOneDeploymentArgs = {
      where: {
        id: EXAMPLE_DEPLOYMENT_ID
      }
    };
    expect(await service.findOne(args)).toEqual(EXAMPLE_DEPLOYMENT);
  });

  test('deploys correctly', async () => {
    prismaDeploymentFindOneMock.mockImplementation(
      () => EXAMPLE_DEPLOYMENT_WITH_BUILD_AND_ENVIRONMENT
    );

    expect(await service.deploy(EXAMPLE_DEPLOYMENT_ID)).toBeUndefined();
    expect(prismaDeploymentFindOneMock).toBeCalledTimes(1);
    expect(prismaDeploymentFindOneMock).toBeCalledWith({
      where: { id: EXAMPLE_DEPLOYMENT_ID },
      include: DEPLOY_DEPLOYMENT_INCLUDE
    });
    expect(actionServiceRunMock).toBeCalledTimes(1);
    expect(actionServiceRunMock).toBeCalledWith(
      EXAMPLE_ACTION_ID,
      DEPLOY_STEP_NAME,
      DEPLOY_STEP_MESSAGE,
      expect.any(Function),
      true
    );
    expect(configServiceGetMock).toBeCalledTimes(6);
    expect(configServiceGetMock.mock.calls).toEqual([
      [DEPLOYER_DEFAULT_VAR],
      [GCP_APPS_PROJECT_ID_VAR],
      [GCP_APPS_TERRAFORM_STATE_BUCKET_VAR],
      [GCP_APPS_REGION_VAR],
      [GCP_APPS_DATABASE_INSTANCE_VAR],
      [GCP_APPS_DOMAIN_VAR]
    ]);
    expect(deployerServiceDeploy).toBeCalledTimes(1);
    expect(deployerServiceDeploy).toBeCalledWith(
      gcpDeployConfiguration,
      {
        [TERRAFORM_APP_ID_VARIABLE]: EXAMPLE_APP_ID,
        [TERRAFORM_IMAGE_ID_VARIABLE]: EXAMPLE_IMAGE_ID,
        [GCP_TERRAFORM_PROJECT_VARIABLE]: EXAMPLE_GCP_APPS_PROJECT_ID,
        [GCP_TERRAFORM_REGION_VARIABLE]: EXAMPLE_GCP_APPS_REGION,
        [GCP_TERRAFORM_DATABASE_INSTANCE_NAME_VARIABLE]: EXAMPLE_GCP_APPS_DATABASE_INSTANCE,
        [GCP_TERRAFORM_DOMAIN_VARIABLE]: domain.join([
          EXAMPLE_ENVIRONMENT.address,
          EXAMPLE_GCP_APPS_DOMAIN
        ])
      },
      {
        bucket: EXAMPLE_GCP_APPS_TERRAFORM_STATE_BUCKET,
        prefix: EXAMPLE_APP_ID
      },
      DeployerProvider.GCP
    );
  });

  it('should auto deploy to sandbox', async () => {
    const createArgs = {
      data: {
        build: {
          connect: {
            id: EXAMPLE_BUILD_ID
          }
        },
        createdBy: {
          connect: {
            id: EXAMPLE_USER_ID
          }
        },
        environment: {
          connect: {
            id: EXAMPLE_ENVIRONMENT_ID
          }
        },
        message: AUTO_DEPLOY_MESSAGE,
        status: EnumDeploymentStatus.Waiting,
        createdAt: expect.any(Date),
        action: {
          connect: {
            id: EXAMPLE_ACTION_ID
          }
        }
      }
    };
    const findOneArgs = {
      where: { id: EXAMPLE_DEPLOYMENT_ID },
      include: DEPLOY_DEPLOYMENT_INCLUDE
    };
    expect(await service.autoDeployToSandbox(EXAMPLE_BUILD)).toEqual(
      EXAMPLE_DEPLOYMENT
    );
    expect(environmentServiceGetDefaultEnvironmentMock).toBeCalledTimes(1);
    expect(environmentServiceGetDefaultEnvironmentMock).toBeCalledWith(
      EXAMPLE_APP_ID
    );
    expect(prismaDeploymentCreateMock).toBeCalledTimes(1);
    expect(prismaDeploymentCreateMock).toBeCalledWith(createArgs);
    expect(prismaDeploymentFindOneMock).toBeCalledTimes(1);
    expect(prismaDeploymentFindOneMock).toBeCalledWith(findOneArgs);
    expect(actionServiceRunMock).toBeCalledTimes(1);
    expect(actionServiceRunMock).toBeCalledWith(
      EXAMPLE_ACTION_ID,
      DEPLOY_STEP_NAME,
      DEPLOY_STEP_MESSAGE,
      expect.any(Function),
      true
    );
    expect(configServiceGetMock).toBeCalledTimes(6);
    expect(configServiceGetMock).toBeCalledWith(DEPLOYER_DEFAULT_VAR);
  });

  it('should update running deployment status', async () => {
    const findManyArgs = {
      where: {
        statusUpdatedAt: {
          lt: expect.any(Date)
        },
        status: {
          equals: EnumDeploymentStatus.Waiting
        }
      },
      include: ACTION_INCLUDE
    };
    const loggerMessage = `Deployment ${EXAMPLE_DEPLOYMENT_ID}: current status ${EXAMPLE_COMPLETED_DEPLOY_RESULT.status}`;
    expect(await service.updateRunningDeploymentsStatus()).toEqual(undefined);
    expect(prismaDeploymentFindManyMock).toBeCalledTimes(1);
    expect(prismaDeploymentFindManyMock).toBeCalledWith(findManyArgs);
    expect(actionServiceGetStepsMock).toBeCalledTimes(1);
    expect(actionServiceGetStepsMock).toBeCalledWith(EXAMPLE_ACTION_ID);
    expect(deployerServiceGetStatusMock).toBeCalledTimes(1);
    expect(deployerServiceGetStatusMock).toBeCalledWith(
      EXAMPLE_DEPLOYMENT.statusQuery
    );
    expect(loggerInfoMock).toBeCalledTimes(1);
    expect(loggerInfoMock).toBeCalledWith(loggerMessage);
  });
});
