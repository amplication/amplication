import { Readable } from 'stream';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';
import { PrismaService } from 'nestjs-prisma';
import { StorageService } from '@codebrew/nestjs-storage';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { orderBy } from 'lodash';
import { Prisma } from '@prisma/client';
import {
  ACTION_JOB_DONE_LOG,
  GENERATE_STEP_MESSAGE,
  GENERATE_STEP_NAME,
  ACTION_ZIP_LOG,
  BuildService,
  ENTITIES_INCLUDE,
  BUILD_DOCKER_IMAGE_STEP_MESSAGE,
  BUILD_DOCKER_IMAGE_STEP_NAME,
  BUILD_DOCKER_IMAGE_STEP_START_LOG,
  BUILD_DOCKER_IMAGE_STEP_RUNNING_LOG,
  BUILD_DOCKER_IMAGE_STEP_FINISH_LOG,
  BUILD_DOCKER_IMAGE_STEP_FAILED_LOG,
  ACTION_INCLUDE
} from './build.service';
import * as DataServiceGenerator from '@amplication/data-service-generator';
import { ContainerBuilderService } from '@amplication/container-builder/dist/nestjs';
import { EntityService } from '..';
import { AppRoleService } from '../appRole/appRole.service';
import { AppService } from '../app/app.service';
import { ActionService } from '../action/action.service';
import { LocalDiskService } from '../storage/local.disk.service';
import { Build } from './dto/Build';
import { getBuildTarGzFilePath, getBuildZipFilePath } from './storage';
import { FindOneBuildArgs } from './dto/FindOneBuildArgs';
import { BuildNotFoundError } from './errors/BuildNotFoundError';
import { DeploymentService } from '../deployment/deployment.service';
import { UserService } from '../user/user.service';
import {
  BuildResult,
  EnumBuildStatus as ContainerBuildStatus
} from '@amplication/container-builder/dist/';
import { EnumBuildStatus } from 'src/core/build/dto/EnumBuildStatus';
import { App, Commit, Entity } from 'src/models';
import {
  ActionStep,
  EnumActionLogLevel,
  EnumActionStepStatus
} from '../action/dto';
import { Deployment } from '../deployment/dto/Deployment';
import { EnumDeploymentStatus } from '../deployment/dto/EnumDeploymentStatus';
import { Environment } from '../environment/dto';
import { GithubService } from '../github/github.service';
import { AppSettingsService } from '../appSettings/appSettings.service';

import { AppSettingsValues } from '../appSettings/constants';
import { EnumAuthProviderType } from '../appSettings/dto/EnumAuthenticationProviderType';

jest.mock('winston');
jest.mock('@amplication/data-service-generator');

const winstonConsoleTransportOnMock = jest.fn();
const MOCK_CONSOLE_TRANSPORT = {
  on: winstonConsoleTransportOnMock
};
const winstonLoggerDestroyMock = jest.fn();
const MOCK_LOGGER = {
  destroy: winstonLoggerDestroyMock
};
// eslint-disable-next-line
// @ts-ignore
winston.createLogger.mockImplementation(() => MOCK_LOGGER);
// eslint-disable-next-line
// @ts-ignore
winston.transports.Console = jest.fn(() => MOCK_CONSOLE_TRANSPORT);

const EXAMPLE_COMMIT_ID = 'exampleCommitId';
const EXAMPLE_BUILD_ID = 'ExampleBuildId';
const EXAMPLE_USER_ID = 'ExampleUserId';
const EXAMPLE_ENTITY_VERSION_ID = 'ExampleEntityVersionId';
const EXAMPLE_APP_ID = 'exampleAppId';
const EXAMPLE_DATE = new Date('2020-01-01');

const JOB_STARTED_LOG = 'Build job started';
const JOB_DONE_LOG = 'Build job done';

const EXAMPLE_DEPLOYMENT_ID = 'exampleDeploymentId';
const EXAMPLE_ENVIRONMENT_ID = 'exampleEnvironmentId';
const EXAMPLE_DEPLOYMENT_MESSAGE = 'exampleDeploymentMessage';
const EXAMPLE_ACTION_ID = 'exampleActionId';
const EXAMPLE_ENVIRONMENT_NAME = 'exampleEnvironmentName';
const EXAMPLE_ADDRESS = 'exampleAddress';

const EXAMPLE_MESSAGE = 'exampleMessage';

const EXAMPLE_APP_SETTINGS_VALUES: AppSettingsValues = {
  dbHost: 'localhost',
  dbName: 'myDb',
  dbPassword: '1234',
  dbPort: 5432,
  dbUser: 'admin',
  appId: EXAMPLE_APP_ID,
  authProvider: EnumAuthProviderType.Jwt
};

const EXAMPLE_COMMIT: Commit = {
  id: EXAMPLE_COMMIT_ID,
  createdAt: new Date(),
  userId: EXAMPLE_USER_ID,
  message: EXAMPLE_MESSAGE
};

const EXAMPLE_GENERATE_STEP = {
  id: 'ExampleActionStepId',
  createdAt: new Date(),
  message: GENERATE_STEP_MESSAGE,
  name: GENERATE_STEP_NAME,
  status: EnumActionStepStatus.Running
};
const EXAMPLE_COMPLETED_GENERATE_STEP = {
  ...EXAMPLE_GENERATE_STEP,
  status: EnumActionStepStatus.Success,
  completedAt: new Date()
};
const EXAMPLE_FAILED_GENERATE_STEP = {
  ...EXAMPLE_GENERATE_STEP,
  status: EnumActionStepStatus.Failed,
  completedAt: new Date()
};
const EXAMPLE_DOCKER_IMAGE_STEP = {
  id: 'ExampleDockerImageStep',
  createdAt: new Date(),
  message: BUILD_DOCKER_IMAGE_STEP_MESSAGE,
  name: BUILD_DOCKER_IMAGE_STEP_NAME,
  status: EnumActionStepStatus.Running
};
const EXAMPLE_COMPLETED_DOCKER_IMAGE_STEP = {
  ...EXAMPLE_DOCKER_IMAGE_STEP,
  status: EnumActionStepStatus.Success,
  completedAt: new Date()
};
const EXAMPLE_ACTION = {
  id: 'ExampleActionId',
  createdAt: new Date(),
  steps: [EXAMPLE_GENERATE_STEP]
};
const EXAMPLE_BUILD: Build = {
  id: EXAMPLE_BUILD_ID,
  createdAt: EXAMPLE_DATE,
  userId: EXAMPLE_USER_ID,
  appId: EXAMPLE_APP_ID,
  version: '1.0.0',
  message: 'new build',
  actionId: EXAMPLE_ACTION.id,
  images: [],
  commitId: EXAMPLE_COMMIT_ID,
  action: EXAMPLE_ACTION
};

const EXAMPLE_COMPLETED_BUILD: Build = {
  ...EXAMPLE_BUILD,
  id: 'ExampleSuccessfulBuild',
  containerStatusQuery: true,
  containerStatusUpdatedAt: new Date(),
  action: {
    id: 'ExampleSuccessfulBuildAction',
    createdAt: new Date(),
    steps: [
      EXAMPLE_COMPLETED_GENERATE_STEP,
      EXAMPLE_COMPLETED_DOCKER_IMAGE_STEP
    ]
  }
};
const EXAMPLE_RUNNING_BUILD: Build = {
  ...EXAMPLE_BUILD,
  id: 'ExampleRunningBuild',
  containerStatusQuery: true,
  containerStatusUpdatedAt: new Date()
};

const EXAMPLE_FAILED_BUILD: Build = {
  ...EXAMPLE_BUILD,
  id: 'ExampleFailedBuild',
  action: {
    id: 'ExampleFailedBuildAction',
    createdAt: new Date(),
    steps: [EXAMPLE_FAILED_GENERATE_STEP]
  }
};
const EXAMPLE_RUNNING_DELAYED_BUILD = {
  ...EXAMPLE_RUNNING_BUILD,
  id: 'ExampleRunningDelayedBuild',
  action: {
    id: 'ExampleRunningDelayedBuildAction',
    createdAt: new Date(),
    steps: [EXAMPLE_GENERATE_STEP, EXAMPLE_DOCKER_IMAGE_STEP]
  }
};
const EXAMPLE_INVALID_BUILD: Build = {
  ...EXAMPLE_BUILD,
  id: 'ExampleInvalidBuild',
  action: undefined
};

const EXAMPLE_ENVIRONMENT: Environment = {
  id: EXAMPLE_ENVIRONMENT_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  name: EXAMPLE_ENVIRONMENT_NAME,
  address: EXAMPLE_ADDRESS,
  appId: EXAMPLE_APP_ID
};

const EXAMPLE_DEPLOYMENT: Deployment = {
  id: EXAMPLE_DEPLOYMENT_ID,
  status: EnumDeploymentStatus.Waiting,
  createdAt: new Date(),
  userId: EXAMPLE_USER_ID,
  buildId: EXAMPLE_BUILD_ID,
  environmentId: EXAMPLE_ENVIRONMENT_ID,
  message: EXAMPLE_DEPLOYMENT_MESSAGE,
  actionId: EXAMPLE_ACTION_ID,
  build: EXAMPLE_BUILD,
  environment: EXAMPLE_ENVIRONMENT
};

const EXAMPLE_USER = {
  id: EXAMPLE_USER_ID
};

const EXAMPLE_COMPLETED_BUILD_RESULT: BuildResult = {
  status: ContainerBuildStatus.Completed
};
const EXAMPLE_FAILED_BUILD_RESULT: BuildResult = {
  status: ContainerBuildStatus.Failed
};
const EXAMPLE_RUNNING_BUILD_RESULT: BuildResult = {
  status: ContainerBuildStatus.Running
};

const EXAMPLE_APP_ROLES = [];

const EXAMPLE_APP: App = {
  id: 'exampleAppId',
  createdAt: new Date(),
  updatedAt: new Date(),
  name: 'exampleAppName',
  description: 'example App Description',
  color: '#20A4F3',
  githubSyncEnabled: false
};

const EXAMPLE_BUILD_INCLUDE_APP_AND_COMMIT: Build = {
  ...EXAMPLE_BUILD,
  commit: EXAMPLE_COMMIT,
  app: EXAMPLE_APP
};

const commitId = EXAMPLE_COMMIT_ID;
const version = commitId.slice(commitId.length - 8);
const EXAMPLE_CREATE_INITIAL_STEP_DATA = {
  message: 'Adding task to queue',
  name: 'ADD_TO_QUEUE',
  status: EnumActionStepStatus.Success,
  completedAt: EXAMPLE_DATE,
  logs: {
    create: [
      {
        level: EnumActionLogLevel.Info,
        message: 'create build generation task',
        meta: {}
      },
      {
        level: EnumActionLogLevel.Info,
        message: `Build Version: ${version}`,
        meta: {}
      },
      {
        level: EnumActionLogLevel.Info,
        message: `Build message: ${EXAMPLE_BUILD.message}`,
        meta: {}
      }
    ]
  }
};

const EXAMPLE_MODULES = [];

const prismaBuildCreateMock = jest.fn(
  () => EXAMPLE_BUILD_INCLUDE_APP_AND_COMMIT
);

const prismaBuildFindOneMock = jest.fn();

const prismaBuildFindManyMock = jest.fn(() => {
  return [EXAMPLE_BUILD];
});

const prismaBuildUpdateMock = jest.fn();

const entityServiceGetLatestVersionsMock = jest.fn(() => {
  return [{ id: EXAMPLE_ENTITY_VERSION_ID }];
});

const EXAMPLE_FIRST_ENTITY_NAME = 'AA First Entity';
const EXAMPLE_SECOND_ENTITY_NAME = 'BB second Entity';

const EXAMPLE_ENTITIES: Entity[] = [
  {
    id: 'EXAMPLE_SECOND_ID',
    createdAt: new Date('2020-02-17 18:20:20'),
    updatedAt: new Date(),
    appId: 'exampleAppId',
    name: EXAMPLE_SECOND_ENTITY_NAME,
    displayName: 'Second entity',
    pluralDisplayName: 'Second entity plural display name'
  },
  {
    id: 'EXAMPLE_FIRST_ID',
    createdAt: new Date('2020-02-10 18:20:20'), //created first
    updatedAt: new Date(),
    appId: 'exampleAppId',
    name: EXAMPLE_FIRST_ENTITY_NAME,
    displayName: 'First entity',
    pluralDisplayName: 'First entity plural display name'
  }
];

const entityServiceGetEntitiesByVersionsMock = jest.fn(() => EXAMPLE_ENTITIES);

const appRoleServiceGetAppRolesMock = jest.fn(() => EXAMPLE_APP_ROLES);

const appServiceGetAppMock = jest.fn(() => EXAMPLE_APP);

const EXAMPLE_ACTION_STEP: ActionStep = {
  id: 'EXAMPLE_ACTION_STEP_ID',
  name: 'EXAMPLE_ACTION_STEP_NAME',
  createdAt: new Date(),
  message: 'EXAMPLE_ACTION_STEP_MESSAGE',
  status: EnumActionStepStatus.Running
};
const EXAMPLE_FAILED_ACTION_STEP: ActionStep = {
  ...EXAMPLE_ACTION_STEP,
  status: EnumActionStepStatus.Failed
};

const deploymentFindManyMock = jest.fn();

const actionServiceRunMock = jest.fn(
  async (
    actionId: string,
    stepName: string,
    message: string,
    stepFunction: (step: { id: string }) => Promise<any>,
    leaveStepOpenAfterSuccessfulExecution = false
  ) => {
    return stepFunction(EXAMPLE_ACTION_STEP);
  }
);
const actionServiceLogInfoMock = jest.fn();
const actionServiceLogMock = jest.fn();

const EXAMPLE_DOCKER_BUILD_RESULT_RUNNING: BuildResult = {
  status: ContainerBuildStatus.Running,
  statusQuery: { id: 'buildId' }
};

const containerBuilderServiceBuildMock = jest.fn(
  () => EXAMPLE_DOCKER_BUILD_RESULT_RUNNING
);

const EXAMPLE_STREAM = new Readable();
const EXAMPLE_URL = 'EXAMPLE_URL';

const storageServiceDiskExistsMock = jest.fn(() => ({ exists: true }));
const storageServiceDiskStreamMock = jest.fn(() => EXAMPLE_STREAM);
const storageServiceDiskPutMock = jest.fn();
const storageServiceDiskGetUrlMock = jest.fn(() => EXAMPLE_URL);

const EXAMPLE_LOCAL_DISK = {
  config: {
    root: 'EXAMPLE_ROOT'
  }
};

const localDiskServiceGetDiskMock = jest.fn(() => EXAMPLE_LOCAL_DISK);

const EXAMPLED_HOST = 'http://localhost';
const configServiceGetMock = jest.fn(() => EXAMPLED_HOST);

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
const containerBuilderServiceGetStatusMock = jest.fn(
  () => EXAMPLE_DOCKER_BUILD_RESULT_RUNNING
);
const createImageIdMock = jest.fn(tag => tag);
const actionServiceCompleteMock = jest.fn(() => ({}));

const userServiceFindUserMock = jest.fn(() => EXAMPLE_USER);

const deploymentAutoDeployToSandboxMock = jest.fn(() => EXAMPLE_DEPLOYMENT);

const getAppSettingsValuesMock = jest.fn(() => EXAMPLE_APP_SETTINGS_VALUES);

describe('BuildService', () => {
  let service: BuildService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BuildService,
        {
          provide: ConfigService,
          useValue: {
            get: configServiceGetMock
          }
        },
        {
          provide: PrismaService,
          useValue: {
            build: {
              create: prismaBuildCreateMock,
              findMany: prismaBuildFindManyMock,
              findUnique: prismaBuildFindOneMock,
              update: prismaBuildUpdateMock
            }
          }
        },
        {
          provide: StorageService,
          useValue: {
            registerDriver() {
              return;
            },
            getDisk() {
              return {
                exists: storageServiceDiskExistsMock,
                getStream: storageServiceDiskStreamMock,
                put: storageServiceDiskPutMock,
                getUrl: storageServiceDiskGetUrlMock
              };
            }
          }
        },
        {
          provide: EntityService,
          useValue: {
            getLatestVersions: entityServiceGetLatestVersionsMock,
            getEntitiesByVersions: entityServiceGetEntitiesByVersionsMock
          }
        },
        {
          provide: AppRoleService,
          useValue: {
            getAppRoles: appRoleServiceGetAppRolesMock
          }
        },
        {
          provide: AppService,
          useValue: {
            app: appServiceGetAppMock
          }
        },
        {
          provide: ActionService,
          useValue: {
            run: actionServiceRunMock,
            logInfo: actionServiceLogInfoMock,
            complete: actionServiceCompleteMock
          }
        },
        {
          provide: ContainerBuilderService,
          useValue: {
            build: containerBuilderServiceBuildMock,
            getStatus: containerBuilderServiceGetStatusMock,
            createImageId: createImageIdMock
          }
        },
        {
          provide: LocalDiskService,
          useValue: {
            getDisk: localDiskServiceGetDiskMock
          }
        },
        {
          provide: DeploymentService,
          useValue: {
            findMany: deploymentFindManyMock,
            autoDeployToSandbox: deploymentAutoDeployToSandboxMock,
            canDeploy: true
          }
        },
        {
          provide: UserService,
          useValue: {
            findUser: userServiceFindUserMock
          }
        },
        {
          provide: AppSettingsService,
          useValue: {
            getAppSettingsValues: getAppSettingsValuesMock
          }
        },
        {
          provide: GithubService,
          useValue: {}
        },
        {
          provide: WINSTON_MODULE_PROVIDER,
          useValue: {
            error: loggerErrorMock,
            child: loggerChildMock,
            format: EXAMPLE_LOGGER_FORMAT
          }
        }
      ]
    }).compile();

    service = module.get<BuildService>(BuildService);
  });

  test('should be defined', () => {
    expect(service).toBeDefined();
  });

  test('creates build', async () => {
    // eslint-disable-next-line
    // @ts-ignore
    DataServiceGenerator.createDataService.mockImplementation(
      () => EXAMPLE_MODULES
    );

    const args = {
      data: {
        createdBy: {
          connect: {
            id: EXAMPLE_USER_ID
          }
        },
        app: {
          connect: {
            id: EXAMPLE_APP_ID
          }
        },
        message: EXAMPLE_BUILD.message,
        commit: {
          connect: {
            id: EXAMPLE_COMMIT_ID
          }
        }
      }
    };
    const commitId = EXAMPLE_COMMIT_ID;
    const version = commitId.slice(commitId.length - 8);
    const latestEntityVersions = [{ id: EXAMPLE_ENTITY_VERSION_ID }];
    expect(await service.create(args)).toEqual(
      EXAMPLE_BUILD_INCLUDE_APP_AND_COMMIT
    );
    expect(entityServiceGetLatestVersionsMock).toBeCalledTimes(1);
    expect(entityServiceGetLatestVersionsMock).toBeCalledWith({
      where: { app: { id: EXAMPLE_APP_ID } }
    });
    expect(prismaBuildCreateMock).toBeCalledTimes(1);
    expect(prismaBuildCreateMock).toBeCalledWith({
      ...args,
      data: {
        ...args.data,
        version,
        createdAt: expect.any(Date),
        blockVersions: {
          connect: []
        },
        entityVersions: {
          connect: latestEntityVersions.map(version => ({ id: version.id }))
        },
        action: {
          create: {
            steps: {
              create: {
                ...EXAMPLE_CREATE_INITIAL_STEP_DATA,
                completedAt: expect.any(Date)
              }
            }
          }
        }
      },
      include: {
        commit: true,
        app: true
      }
    });
    expect(loggerChildMock).toBeCalledTimes(1);
    expect(loggerChildMock).toBeCalledWith({
      buildId: EXAMPLE_BUILD_ID
    });
    expect(loggerChildInfoMock).toBeCalledTimes(2);
    expect(loggerChildInfoMock).toBeCalledWith(JOB_STARTED_LOG);
    expect(loggerChildInfoMock).toBeCalledWith(JOB_DONE_LOG);
    expect(loggerChildMock).toBeCalledTimes(1);
    expect(loggerChildMock).toBeCalledWith({
      buildId: EXAMPLE_BUILD_ID
    });
    expect(loggerChildInfoMock).toBeCalledTimes(2);
    expect(loggerChildInfoMock.mock.calls).toEqual([
      [JOB_STARTED_LOG],
      [JOB_DONE_LOG]
    ]);
    expect(loggerChildErrorMock).toBeCalledTimes(0);

    expect(appServiceGetAppMock).toBeCalledTimes(1);
    expect(appServiceGetAppMock).toBeCalledWith({
      where: { id: EXAMPLE_APP_ID }
    });

    expect(entityServiceGetEntitiesByVersionsMock).toBeCalledTimes(1);
    expect(entityServiceGetEntitiesByVersionsMock).toBeCalledWith({
      where: {
        builds: {
          some: {
            id: EXAMPLE_BUILD_ID
          }
        }
      },
      include: ENTITIES_INCLUDE
    });
    expect(appRoleServiceGetAppRolesMock).toBeCalledTimes(1);
    expect(appRoleServiceGetAppRolesMock).toBeCalledWith({
      where: {
        app: {
          id: EXAMPLE_APP_ID
        }
      }
    });
    expect(DataServiceGenerator.createDataService).toBeCalledTimes(1);
    expect(DataServiceGenerator.createDataService).toBeCalledWith(
      orderBy(EXAMPLE_ENTITIES, entity => entity.createdAt),
      EXAMPLE_APP_ROLES,
      {
        name: EXAMPLE_APP.name,
        description: EXAMPLE_APP.description,
        version: EXAMPLE_BUILD.version,
        id: EXAMPLE_APP.id,
        url: `${EXAMPLED_HOST}/${EXAMPLE_APP.id}`,
        settings: EXAMPLE_APP_SETTINGS_VALUES
      },
      MOCK_LOGGER
    );
    expect(winstonLoggerDestroyMock).toBeCalledTimes(1);
    expect(winstonLoggerDestroyMock).toBeCalledWith();
    expect(actionServiceRunMock).toBeCalledTimes(2);
    expect(actionServiceRunMock.mock.calls).toEqual([
      [
        EXAMPLE_BUILD.actionId,
        GENERATE_STEP_NAME,
        GENERATE_STEP_MESSAGE,
        expect.any(Function)
      ],
      [
        EXAMPLE_BUILD.actionId,
        BUILD_DOCKER_IMAGE_STEP_NAME,
        BUILD_DOCKER_IMAGE_STEP_MESSAGE,
        expect.any(Function),
        true
      ]
    ]);
    expect(actionServiceLogInfoMock).toBeCalledTimes(4);
    expect(actionServiceLogInfoMock.mock.calls).toEqual([
      [EXAMPLE_ACTION_STEP, ACTION_ZIP_LOG],
      [EXAMPLE_ACTION_STEP, ACTION_JOB_DONE_LOG],
      [EXAMPLE_ACTION_STEP, BUILD_DOCKER_IMAGE_STEP_START_LOG],
      [EXAMPLE_ACTION_STEP, BUILD_DOCKER_IMAGE_STEP_RUNNING_LOG]
    ]);
    expect(actionServiceLogMock).toBeCalledTimes(0);
    expect(storageServiceDiskGetUrlMock).toBeCalledTimes(1);
    expect(storageServiceDiskGetUrlMock).toBeCalledWith(
      getBuildTarGzFilePath(EXAMPLE_BUILD.id)
    );
    expect(localDiskServiceGetDiskMock).toBeCalledTimes(0);
    expect(containerBuilderServiceBuildMock).toBeCalledTimes(1);
    expect(containerBuilderServiceBuildMock).toBeCalledWith({
      tags: [
        `${EXAMPLE_BUILD.appId}:${EXAMPLE_BUILD.id}`,
        `${EXAMPLE_BUILD.appId}:latest`
      ],
      cacheFrom: [`${EXAMPLE_BUILD.appId}:latest`],
      url: EXAMPLE_URL
    });
    expect(prismaBuildUpdateMock).toBeCalledTimes(1);
    expect(prismaBuildUpdateMock).toBeCalledWith({
      where: {
        id: EXAMPLE_BUILD_ID
      },
      data: {
        containerStatusQuery: EXAMPLE_DOCKER_BUILD_RESULT_RUNNING.statusQuery,
        containerStatusUpdatedAt: expect.any(Date)
      }
    });
    expect(winstonConsoleTransportOnMock).toBeCalledTimes(1);
    /** @todo add expect(winstonConsoleTransportOnMock).toBeCalledWith() */
    expect(winstonLoggerDestroyMock).toBeCalledTimes(1);
    expect(winstonLoggerDestroyMock).toBeCalledWith();
    expect(winston.createLogger).toBeCalledTimes(1);
    /** @todo add expect(winston.createLogger).toBeCalledWith() */
    expect(winston.transports.Console).toBeCalledTimes(1);
    expect(winston.transports.Console).toBeCalledWith();
  });

  test('find many builds', async () => {
    const args = {};
    expect(await service.findMany(args)).toEqual([EXAMPLE_BUILD]);
    expect(prismaBuildFindManyMock).toBeCalledTimes(1);
    expect(prismaBuildFindManyMock).toBeCalledWith(args);
  });

  test('find one build', async () => {
    prismaBuildFindOneMock.mockImplementation(() => EXAMPLE_BUILD);
    const args: FindOneBuildArgs = {
      where: {
        id: EXAMPLE_BUILD_ID
      }
    };
    expect(await service.findOne(args)).toEqual(EXAMPLE_BUILD);
    expect(prismaBuildFindOneMock).toBeCalledTimes(1);
    expect(prismaBuildFindOneMock).toBeCalledWith(args);
  });

  test('do not find non existing build', async () => {
    prismaBuildFindOneMock.mockImplementation(() => null);
    const args: FindOneBuildArgs = {
      where: {
        id: 'nonExistingId'
      }
    };
    expect(await service.findOne(args)).toEqual(null);
    expect(prismaBuildFindOneMock).toBeCalledTimes(1);
    expect(prismaBuildFindOneMock).toBeCalledWith(args);
  });

  test('create download stream for build', async () => {
    prismaBuildFindOneMock.mockImplementation(() =>
      Object.assign(Promise.resolve(EXAMPLE_BUILD), {
        action: () => ({
          steps: () => [
            {
              name: GENERATE_STEP_NAME,
              status: EnumActionStepStatus.Success
            }
          ]
        })
      })
    );
    const args: FindOneBuildArgs = {
      where: {
        id: EXAMPLE_COMPLETED_BUILD.id
      }
    };
    expect(await service.download(args)).toEqual(EXAMPLE_STREAM);
    expect(prismaBuildFindOneMock).toBeCalledTimes(2);
    expect(prismaBuildFindOneMock).toBeCalledWith(args);
    const buildFilePath = getBuildZipFilePath(EXAMPLE_COMPLETED_BUILD.id);
    expect(storageServiceDiskExistsMock).toBeCalledTimes(1);
    expect(storageServiceDiskExistsMock).toBeCalledWith(buildFilePath);
    expect(storageServiceDiskStreamMock).toBeCalledTimes(1);
    expect(storageServiceDiskStreamMock).toBeCalledWith(buildFilePath);
  });

  test('fail to create download stream for a non existing build', async () => {
    prismaBuildFindOneMock.mockImplementation(() => null);
    const args: FindOneBuildArgs = {
      where: {
        id: 'nonExistingId'
      }
    };
    await expect(service.download(args)).rejects.toThrow(BuildNotFoundError);
    expect(prismaBuildFindOneMock).toBeCalledTimes(1);
    expect(prismaBuildFindOneMock).toBeCalledWith(args);
    expect(storageServiceDiskExistsMock).toBeCalledTimes(0);
    expect(storageServiceDiskStreamMock).toBeCalledTimes(0);
  });

  /**
   * fail to get generated app archive for non existing step
   * fail to get generated app archive for uncompleted step
   */

  test('get deployments', async () => {
    await expect(service.getDeployments(EXAMPLE_BUILD_ID, {}));
    expect(deploymentFindManyMock).toBeCalledTimes(1);
    expect(deploymentFindManyMock).toBeCalledWith({
      where: {
        build: {
          id: EXAMPLE_BUILD_ID
        }
      }
    });
  });

  it('should return invalid', async () => {
    prismaBuildFindOneMock.mockImplementation(() => EXAMPLE_INVALID_BUILD);
    const invalid = EnumBuildStatus.Invalid;
    const buildId = EXAMPLE_INVALID_BUILD.id;
    const findOneArgs = {
      where: { id: buildId },
      include: ACTION_INCLUDE
    };
    expect(await service.calcBuildStatus(buildId)).toEqual(invalid);
    expect(prismaBuildFindOneMock).toBeCalledTimes(1);
    expect(prismaBuildFindOneMock).toBeCalledWith(findOneArgs);
  });

  it('should return build status Running', async () => {
    prismaBuildFindOneMock.mockImplementation(() => EXAMPLE_RUNNING_BUILD);
    const buildId = EXAMPLE_RUNNING_BUILD.id;
    const findOneArgs = {
      where: { id: buildId },
      include: ACTION_INCLUDE
    };
    expect(await service.calcBuildStatus(buildId)).toEqual(
      EnumBuildStatus.Running
    );
    expect(prismaBuildFindOneMock).toBeCalledTimes(1);
    expect(prismaBuildFindOneMock).toBeCalledWith(findOneArgs);
  });

  it('should return build status Failed', async () => {
    prismaBuildFindOneMock.mockImplementation(() => EXAMPLE_FAILED_BUILD);
    const buildId = EXAMPLE_FAILED_BUILD.id;
    const findOneArgs = {
      where: { id: buildId },
      include: ACTION_INCLUDE
    };
    expect(await service.calcBuildStatus(buildId)).toEqual(
      EnumBuildStatus.Failed
    );
    expect(prismaBuildFindOneMock).toBeCalledTimes(1);
    expect(prismaBuildFindOneMock).toBeCalledWith(findOneArgs);
  });

  it('should return build status Completed', async () => {
    prismaBuildFindOneMock.mockImplementation(() => EXAMPLE_COMPLETED_BUILD);
    const buildId = EXAMPLE_COMPLETED_BUILD.id;
    const findOneArgs = {
      where: { id: buildId },
      include: ACTION_INCLUDE
    };
    expect(await service.calcBuildStatus(buildId)).toEqual(
      EnumBuildStatus.Completed
    );
    expect(prismaBuildFindOneMock).toBeCalledTimes(1);
    expect(prismaBuildFindOneMock).toBeCalledWith(findOneArgs);
  });

  it('should try to get build status and return Running', async () => {
    prismaBuildFindOneMock.mockImplementation(() => ({
      ...EXAMPLE_BUILD,
      action: {
        ...EXAMPLE_BUILD.action,
        steps: [EXAMPLE_ACTION_STEP]
      }
    }));
    expect(await service.calcBuildStatus(EXAMPLE_BUILD_ID)).toEqual(
      EnumBuildStatus.Running
    );
    expect(prismaBuildFindOneMock).toBeCalledTimes(1);
    expect(prismaBuildFindOneMock).toBeCalledWith({
      where: { id: EXAMPLE_BUILD_ID },
      include: ACTION_INCLUDE
    });
  });

  it('should try to get build status, catch an error and return Failed', async () => {
    prismaBuildFindOneMock.mockImplementation(() => ({
      ...EXAMPLE_BUILD,
      action: {
        ...EXAMPLE_BUILD.action,
        steps: [EXAMPLE_FAILED_ACTION_STEP]
      }
    }));
    expect(await service.calcBuildStatus(EXAMPLE_BUILD_ID)).toEqual(
      EnumBuildStatus.Failed
    );
    expect(prismaBuildFindOneMock).toBeCalledTimes(1);
    expect(prismaBuildFindOneMock).toBeCalledWith({
      where: { id: EXAMPLE_BUILD_ID },
      include: ACTION_INCLUDE
    });
  });

  it('should update running build status', async () => {
    prismaBuildFindManyMock.mockImplementation(() => [
      EXAMPLE_RUNNING_DELAYED_BUILD
    ]);
    const findManyArgs = {
      where: {
        containerStatusUpdatedAt: {
          lt: expect.any(Date)
        },
        action: {
          steps: {
            some: {
              status: {
                equals: EnumActionStepStatus.Running
              },
              name: {
                equals: BUILD_DOCKER_IMAGE_STEP_NAME
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: Prisma.SortOrder.asc
      },
      include: ACTION_INCLUDE
    };

    expect(await service.updateRunningBuildsStatus()).toEqual(undefined);
    expect(prismaBuildFindManyMock).toBeCalledTimes(1);
    expect(prismaBuildFindManyMock).toBeCalledWith(findManyArgs);
    expect(containerBuilderServiceGetStatusMock).toBeCalledTimes(1);
    expect(containerBuilderServiceGetStatusMock).toBeCalledWith(
      EXAMPLE_RUNNING_BUILD.containerStatusQuery
    );
    expect(actionServiceLogInfoMock).toBeCalledTimes(1);
    expect(actionServiceLogInfoMock).toBeCalledWith(
      EXAMPLE_DOCKER_IMAGE_STEP,
      BUILD_DOCKER_IMAGE_STEP_RUNNING_LOG
    );
    expect(prismaBuildUpdateMock).toBeCalledTimes(1);
    expect(prismaBuildUpdateMock).toBeCalledWith({
      where: { id: EXAMPLE_RUNNING_DELAYED_BUILD.id },
      data: {
        containerStatusQuery: EXAMPLE_DOCKER_BUILD_RESULT_RUNNING.statusQuery,
        containerStatusUpdatedAt: expect.any(Date)
      }
    });
  });
  it('should try update running build status but catch an error', async () => {
    const EXAMPLE_ERROR = new Error('exampleError');
    prismaBuildFindManyMock.mockImplementation(() => [
      EXAMPLE_RUNNING_DELAYED_BUILD
    ]);
    containerBuilderServiceGetStatusMock.mockImplementation(() => {
      throw EXAMPLE_ERROR;
    });
    const findManyArgs = {
      where: {
        containerStatusUpdatedAt: {
          lt: expect.any(Date)
        },
        action: {
          steps: {
            some: {
              status: {
                equals: EnumActionStepStatus.Running
              },
              name: {
                equals: BUILD_DOCKER_IMAGE_STEP_NAME
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: Prisma.SortOrder.asc
      },
      include: ACTION_INCLUDE
    };

    expect(await service.updateRunningBuildsStatus()).toEqual(undefined);
    expect(prismaBuildFindManyMock).toBeCalledTimes(1);
    expect(prismaBuildFindManyMock).toBeCalledWith(findManyArgs);
    expect(containerBuilderServiceGetStatusMock).toBeCalledTimes(1);
    expect(containerBuilderServiceGetStatusMock).toBeCalledWith(
      EXAMPLE_RUNNING_BUILD.containerStatusQuery
    );
    expect(actionServiceLogInfoMock).toBeCalledTimes(1);
    expect(actionServiceLogInfoMock).toBeCalledWith(
      EXAMPLE_DOCKER_IMAGE_STEP,
      EXAMPLE_ERROR
    );
    expect(actionServiceCompleteMock).toBeCalledTimes(1);
    expect(actionServiceCompleteMock).toBeCalledWith(
      EXAMPLE_DOCKER_IMAGE_STEP,
      EnumActionStepStatus.Failed
    );
  });

  it('should handle container builder completed result', async () => {
    expect(
      await service.handleContainerBuilderResult(
        EXAMPLE_BUILD,
        EXAMPLE_ACTION_STEP,
        EXAMPLE_COMPLETED_BUILD_RESULT
      )
    ).toEqual(undefined);
    expect(actionServiceLogInfoMock).toBeCalledTimes(1);
    expect(actionServiceLogInfoMock).toBeCalledWith(
      EXAMPLE_ACTION_STEP,
      BUILD_DOCKER_IMAGE_STEP_FINISH_LOG,
      { images: EXAMPLE_COMPLETED_BUILD_RESULT.images }
    );
    expect(actionServiceCompleteMock).toBeCalledTimes(1);
    expect(actionServiceCompleteMock).toBeCalledWith(
      EXAMPLE_ACTION_STEP,
      EnumActionStepStatus.Success
    );
    expect(prismaBuildUpdateMock).toBeCalledTimes(1);
    expect(prismaBuildUpdateMock).toBeCalledWith({
      where: { id: EXAMPLE_BUILD_ID },
      data: { images: { set: EXAMPLE_COMPLETED_BUILD_RESULT.images } }
    });
    expect(deploymentAutoDeployToSandboxMock).toBeCalledTimes(1);
    expect(deploymentAutoDeployToSandboxMock).toBeCalledWith(EXAMPLE_BUILD);
  });

  it('should handle container builder failed result', async () => {
    expect(
      await service.handleContainerBuilderResult(
        EXAMPLE_BUILD,
        EXAMPLE_ACTION_STEP,
        EXAMPLE_FAILED_BUILD_RESULT
      )
    ).toEqual(undefined);
    expect(actionServiceLogInfoMock).toBeCalledTimes(1);
    expect(actionServiceLogInfoMock).toBeCalledWith(
      EXAMPLE_ACTION_STEP,
      BUILD_DOCKER_IMAGE_STEP_FAILED_LOG
    );
    expect(actionServiceCompleteMock).toBeCalledTimes(1);
    expect(actionServiceCompleteMock).toBeCalledWith(
      EXAMPLE_ACTION_STEP,
      EnumActionStepStatus.Failed
    );
  });

  it('should handle container builder running result', async () => {
    expect(
      await service.handleContainerBuilderResult(
        EXAMPLE_BUILD,
        EXAMPLE_ACTION_STEP,
        EXAMPLE_RUNNING_BUILD_RESULT
      )
    ).toEqual(undefined);
    expect(actionServiceLogInfoMock).toBeCalledTimes(1);
    expect(actionServiceLogInfoMock).toBeCalledWith(
      EXAMPLE_ACTION_STEP,
      BUILD_DOCKER_IMAGE_STEP_RUNNING_LOG
    );
    expect(prismaBuildUpdateMock).toBeCalledTimes(1);
    expect(prismaBuildUpdateMock).toBeCalledWith({
      where: { id: EXAMPLE_BUILD_ID },
      data: {
        containerStatusQuery: EXAMPLE_RUNNING_BUILD_RESULT.statusQuery,
        containerStatusUpdatedAt: expect.any(Date)
      }
    });
  });
});
