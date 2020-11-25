import { Readable } from 'stream';
import { Test, TestingModule } from '@nestjs/testing';
import * as winston from 'winston';
import { PrismaService } from 'nestjs-prisma';
import { StorageService } from '@codebrew/nestjs-storage';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import {
  ACTION_JOB_DONE_LOG,
  GENERATE_STEP_MESSAGE,
  GENERATE_STEP_NAME,
  ACTION_ZIP_LOG,
  BuildService,
  ENTITIES_INCLUDE,
  BUILD_DOCKER_IMAGE_STEP_MESSAGE,
  BUILD_DOCKER_IMAGE_STEP_NAME,
  GENERATED_APP_BASE_IMAGE_BUILD_ARG,
  BUILD_DOCKER_IMAGE_STEP_START_LOG,
  BUILD_DOCKER_IMAGE_STEP_RUNNING_LOG
} from './build.service';
import * as DataServiceGenerator from 'amplication-data-service-generator';
import { ContainerBuilderService } from 'amplication-container-builder/dist/nestjs';
import { EntityService } from '..';
import { AppRoleService } from '../appRole/appRole.service';
import { AppService } from '../app/app.service';
import { ActionService } from '../action/action.service';
import { EnumActionStepStatus } from '../action/dto/EnumActionStepStatus';
import { LocalDiskService } from '../storage/local.disk.service';
import { Build } from './dto/Build';
import { getBuildTarGzFilePath, getBuildZipFilePath } from './storage';
import { FindOneBuildArgs } from './dto/FindOneBuildArgs';
import { BuildNotFoundError } from './errors/BuildNotFoundError';
import { BuildNotCompleteError } from './errors/BuildNotCompleteError';
import { BuildResultNotFound } from './errors/BuildResultNotFound';
import { ConfigService } from '@nestjs/config';
import { DeploymentService } from '../deployment/deployment.service';
import {
  BuildResult,
  EnumBuildStatus as ContainerBuildStatus
} from 'amplication-container-builder/dist/';
import { EnumBuildStatus } from 'src/core/build/dto/EnumBuildStatus';
import { App } from 'src/models';
import { ActionStep, EnumActionLogLevel } from '../action/dto';
import { ActionStepStatus } from '@prisma/client';
import { subSeconds } from 'date-fns';

jest.mock('winston');
jest.mock('amplication-data-service-generator');

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
const EXAMPLE_APP_ID = 'ExampleAppId';
const EXAMPLE_DATE = new Date('2020-01-01');

const JOB_STARTED_LOG = 'Build job started';
const JOB_DONE_LOG = 'Build job done';

const EXAMPLE_BUILD: Build = {
  id: EXAMPLE_BUILD_ID,
  createdAt: EXAMPLE_DATE,
  userId: EXAMPLE_USER_ID,
  appId: EXAMPLE_APP_ID,
  version: '1.0.0',
  message: 'new build',
  actionId: 'ExampleActionId',
  images: [],
  commitId: EXAMPLE_COMMIT_ID
};
const EXAMPLE_COMPLETED_BUILD: Build = {
  id: 'ExampleSuccessfulBuild',
  createdAt: new Date(),
  userId: EXAMPLE_USER_ID,
  appId: EXAMPLE_APP_ID,
  version: '1.0.0',
  message: 'new build',
  actionId: 'ExampleActionId',
  action: {
    id: 'ExampleActionId',
    createdAt: new Date(),
    steps: [
      {
        id: 'ExampleActionStepId',
        createdAt: new Date(),
        message: GENERATE_STEP_MESSAGE,
        name: GENERATE_STEP_NAME,
        status: EnumActionStepStatus.Success,
        completedAt: new Date()
      },
      {
        id: 'ExampleActionStepId1',
        createdAt: new Date(),
        message: BUILD_DOCKER_IMAGE_STEP_MESSAGE,
        name: BUILD_DOCKER_IMAGE_STEP_NAME,
        status: EnumActionStepStatus.Success,
        completedAt: new Date()
      }
    ]
  },
  images: [],
  containerStatusQuery: true,
  containerStatusUpdatedAt: new Date(),
  commitId: EXAMPLE_COMMIT_ID
};
const EXAMPLE_RUNNING_BUILD: Build = {
  id: 'ExampleRunningBuild',
  createdAt: new Date(),
  userId: EXAMPLE_USER_ID,
  appId: EXAMPLE_APP_ID,
  version: '1.0.0',
  message: 'new build',
  actionId: 'ExampleActionId',
  action: {
    id: 'ExampleActionId',
    createdAt: new Date(),
    steps: [
      {
        id: 'ExampleActionStepId',
        createdAt: new Date(),
        message: GENERATE_STEP_MESSAGE,
        name: GENERATE_STEP_NAME,
        status: EnumActionStepStatus.Running,
        completedAt: new Date()
      }
    ]
  },
  images: [],
  containerStatusQuery: true,
  containerStatusUpdatedAt: new Date(),
  commitId: EXAMPLE_COMMIT_ID
};

const currentDate = new Date();
const currentDateMinusTen = currentDate.setSeconds(
  currentDate.getSeconds() - 20
);
const EXAMPLE_RUNNING_DELAYED_BUILD: Build = {
  id: 'ExampleRunningDelayedBuild',
  createdAt: new Date(),
  userId: EXAMPLE_USER_ID,
  appId: EXAMPLE_APP_ID,
  version: '1.0.0',
  message: 'new build',
  actionId: 'ExampleDelayedActionId',
  action: {
    id: 'ExampleDelayedActionId',
    createdAt: new Date(),
    steps: [
      {
        id: 'ExampleDelayedActionStepId',
        createdAt: new Date(),
        message: GENERATE_STEP_MESSAGE,
        name: BUILD_DOCKER_IMAGE_STEP_NAME,
        status: EnumActionStepStatus.Running,
        completedAt: new Date()
      }
    ]
  },
  images: [],
  containerStatusQuery: true,
  containerStatusUpdatedAt: new Date(currentDateMinusTen),
  commitId: EXAMPLE_COMMIT_ID
};
const EXAMPLE_FAILED_BUILD: Build = {
  id: 'ExampleFailedBuild',
  createdAt: new Date(),
  userId: EXAMPLE_USER_ID,
  appId: EXAMPLE_APP_ID,
  version: '1.0.0',
  message: 'new build',
  actionId: 'ExampleActionId',
  action: {
    id: 'ExampleActionId',
    createdAt: new Date(),
    steps: [
      {
        id: 'ExampleActionStepId',
        createdAt: new Date(),
        message: GENERATE_STEP_MESSAGE,
        name: GENERATE_STEP_NAME,
        status: EnumActionStepStatus.Failed,
        completedAt: new Date()
      }
    ]
  },
  images: [],
  commitId: EXAMPLE_COMMIT_ID
};
const EXAMPLE_INVALID_BUILD: Build = {
  id: 'ExampleInvalidBuild',
  createdAt: new Date(),
  userId: EXAMPLE_USER_ID,
  appId: EXAMPLE_APP_ID,
  version: '1.0.0',
  message: 'new build',
  actionId: 'ExampleActionId',
  images: [],
  commitId: EXAMPLE_COMMIT_ID
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

const prismaBuildCreateMock = jest.fn(() => EXAMPLE_BUILD);

const prismaBuildFindOneMock = jest.fn((args: FindOneBuildArgs) => {
  switch (args.where.id) {
    case EXAMPLE_BUILD_ID:
      return EXAMPLE_BUILD;
    case EXAMPLE_COMPLETED_BUILD.id:
      return EXAMPLE_COMPLETED_BUILD;
    case EXAMPLE_FAILED_BUILD.id:
      return EXAMPLE_FAILED_BUILD;
    case EXAMPLE_INVALID_BUILD.id:
      return EXAMPLE_INVALID_BUILD;
    case EXAMPLE_RUNNING_BUILD.id:
      return EXAMPLE_RUNNING_BUILD;
    case EXAMPLE_RUNNING_DELAYED_BUILD.id:
      return EXAMPLE_RUNNING_DELAYED_BUILD;
    default:
      return null;
  }
});

const prismaBuildFindManyMock = jest.fn(() => {
  return [EXAMPLE_BUILD];
});

const prismaBuildUpdateMock = jest.fn();

const entityServiceGetLatestVersionsMock = jest.fn(() => {
  return [{ id: EXAMPLE_ENTITY_VERSION_ID }];
});

const EXAMPLE_ENTITIES = [];

const entityServiceGetEntitiesByVersionsMock = jest.fn(() => EXAMPLE_ENTITIES);

const EXAMPLE_APP_ROLES = [];

const EXAMPLE_APP: App = {
  id: 'exampleAppId',
  createdAt: new Date(),
  updatedAt: new Date(),
  name: 'exampleAppName',
  description: 'example App Description',
  color: '#20A4F3'
};

const appRoleServiceGetAppRolesMock = jest.fn(() => EXAMPLE_APP_ROLES);

const appServiceGetAppMock = jest.fn(() => EXAMPLE_APP);

const EXAMPLE_ACTION_STEP: ActionStep = {
  id: 'EXAMPLE_ACTION_STEP_ID',
  name: 'EXAMPLE_ACTION_STEP_NAME',
  createdAt: new Date(),
  message: 'EXAMPLE_ACTION_STEP_MESSAGE',
  status: ActionStepStatus.Running
};
const EXAMPLE_FAILED_ACTION_STEP: ActionStep = {
  ...EXAMPLE_ACTION_STEP,
  status: ActionStepStatus.Failed
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

const EXAMPLED_GENERATED_BASE_IMAGE = 'EXAMPLED_GENERATED_BASE_IMAGE';
const configServiceGetMock = jest.fn(() => EXAMPLED_GENERATED_BASE_IMAGE);

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
const actionServiceCompleteMock = jest.fn(() => ({}));

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
              findOne: prismaBuildFindOneMock,
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
            getStatus: containerBuilderServiceGetStatusMock
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
            findMany: deploymentFindManyMock
          }
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
    expect(await service.create(args)).toEqual(EXAMPLE_BUILD);
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
      EXAMPLE_ENTITIES,
      EXAMPLE_APP_ROLES,
      {
        name: EXAMPLE_APP.name,
        description: EXAMPLE_APP.description,
        version: EXAMPLE_BUILD.version
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
    expect(containerBuilderServiceBuildMock).toBeCalledWith(
      EXAMPLE_BUILD.appId,
      EXAMPLE_BUILD_ID,
      EXAMPLE_URL,
      {
        [GENERATED_APP_BASE_IMAGE_BUILD_ARG]: EXAMPLED_GENERATED_BASE_IMAGE
      }
    );
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
    const args: FindOneBuildArgs = {
      where: {
        id: EXAMPLE_BUILD_ID
      }
    };
    expect(await service.findOne(args)).toEqual(EXAMPLE_BUILD);
  });

  test('do not find non existing build', async () => {
    const args: FindOneBuildArgs = {
      where: {
        id: 'nonExistingId'
      }
    };
    expect(await service.findOne(args)).toEqual(null);
  });

  test('create download stream for build', async () => {
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

  test('fail to create download stream for a not finished build', async () => {
    const args: FindOneBuildArgs = {
      where: {
        id: EXAMPLE_BUILD_ID
      }
    };
    await expect(service.download(args)).rejects.toThrow(BuildNotCompleteError);
    expect(prismaBuildFindOneMock).toBeCalledTimes(2);
    expect(prismaBuildFindOneMock).toBeCalledWith(args);
    expect(storageServiceDiskExistsMock).toBeCalledTimes(0);
    expect(storageServiceDiskStreamMock).toBeCalledTimes(0);
  });

  test('fail to create download stream for non existing build result', async () => {
    const args: FindOneBuildArgs = {
      where: {
        id: EXAMPLE_COMPLETED_BUILD.id
      }
    };
    storageServiceDiskExistsMock.mockImplementation(() => ({ exists: false }));
    await expect(service.download(args)).rejects.toThrow(BuildResultNotFound);
    expect(prismaBuildFindOneMock).toBeCalledTimes(2);
    expect(prismaBuildFindOneMock).toBeCalledWith(args);
    expect(storageServiceDiskExistsMock).toBeCalledTimes(1);
    expect(storageServiceDiskExistsMock).toBeCalledWith(
      getBuildZipFilePath(EXAMPLE_COMPLETED_BUILD.id)
    );
    expect(storageServiceDiskStreamMock).toBeCalledTimes(0);
  });

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
    const invalid = EnumBuildStatus.Invalid;
    const buildId = EXAMPLE_INVALID_BUILD.id;
    const findOneArgs = {
      where: { id: buildId },
      include: {
        action: {
          include: {
            steps: true
          }
        }
      }
    };
    expect(await service.calcBuildStatus(buildId)).toEqual(invalid);
    expect(prismaBuildFindOneMock).toBeCalledTimes(1);
    expect(prismaBuildFindOneMock).toBeCalledWith(findOneArgs);
  });

  it('should return build status Running', async () => {
    const buildId = EXAMPLE_RUNNING_BUILD.id;
    const findOneArgs = {
      where: { id: buildId },
      include: {
        action: {
          include: {
            steps: true
          }
        }
      }
    };
    expect(await service.calcBuildStatus(buildId)).toEqual(
      EnumBuildStatus.Running
    );
    expect(prismaBuildFindOneMock).toBeCalledTimes(1);
    expect(prismaBuildFindOneMock).toBeCalledWith(findOneArgs);
  });

  it('should return build status Failed', async () => {
    const buildId = EXAMPLE_FAILED_BUILD.id;
    const findOneArgs = {
      where: { id: buildId },
      include: {
        action: {
          include: {
            steps: true
          }
        }
      }
    };
    expect(await service.calcBuildStatus(buildId)).toEqual(
      EnumBuildStatus.Failed
    );
    expect(prismaBuildFindOneMock).toBeCalledTimes(1);
    expect(prismaBuildFindOneMock).toBeCalledWith(findOneArgs);
  });

  it('should return build status Completed', async () => {
    const buildId = EXAMPLE_COMPLETED_BUILD.id;
    const findOneArgs = {
      where: { id: buildId },
      include: {
        action: {
          include: {
            steps: true
          }
        }
      }
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
      include: {
        action: {
          include: {
            steps: true
          }
        }
      }
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
      include: {
        action: {
          include: {
            steps: true
          }
        }
      }
    });
  });

  it('should update running build status', async () => {
    prismaBuildFindManyMock.mockImplementation(() => [
      EXAMPLE_RUNNING_DELAYED_BUILD
    ]);
    const CONTAINER_STATUS_UPDATE_INTERVAL_SEC = 10;
    const findManyArgs = {
      where: {
        containerStatusUpdatedAt: {
          lt: subSeconds(new Date(), CONTAINER_STATUS_UPDATE_INTERVAL_SEC)
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
      include: {
        action: {
          include: {
            steps: true
          }
        }
      }
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
      EXAMPLE_RUNNING_DELAYED_BUILD.action.steps[0],
      BUILD_DOCKER_IMAGE_STEP_RUNNING_LOG
    );
    expect(prismaBuildUpdateMock).toBeCalledTimes(1);
    expect(prismaBuildUpdateMock).toBeCalledWith({
      where: { id: EXAMPLE_RUNNING_DELAYED_BUILD.id },
      data: {
        containerStatusQuery: EXAMPLE_DOCKER_BUILD_RESULT_RUNNING.statusQuery,
        containerStatusUpdatedAt: new Date()
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
    const CONTAINER_STATUS_UPDATE_INTERVAL_SEC = 10;
    const findManyArgs = {
      where: {
        containerStatusUpdatedAt: {
          lt: subSeconds(new Date(), CONTAINER_STATUS_UPDATE_INTERVAL_SEC)
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
      include: {
        action: {
          include: {
            steps: true
          }
        }
      }
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
      EXAMPLE_RUNNING_DELAYED_BUILD.action.steps[0],
      EXAMPLE_ERROR
    );
    expect(actionServiceCompleteMock).toBeCalledTimes(1);
    expect(actionServiceCompleteMock).toBeCalledWith(
      EXAMPLE_RUNNING_DELAYED_BUILD.action.steps[0],
      EnumActionStepStatus.Failed
    );
  });
});
