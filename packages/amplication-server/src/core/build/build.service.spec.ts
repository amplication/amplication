import { Test, TestingModule } from '@nestjs/testing';
import { Readable } from 'stream';
import {
  ACTION_JOB_DONE_LOG,
  GENERATE_STEP_MESSAGE,
  GENERATE_STEP_NAME,
  ACTION_ZIP_LOG,
  BuildService,
  createInitialStepData,
  CREATE_GENERATED_APP_PATH,
  ENTITIES_INCLUDE,
  JOB_DONE_LOG,
  JOB_STARTED_LOG,
  BUILD_DOCKER_IMAGE_STEP_MESSAGE,
  BUILD_DOCKER_IMAGE_STEP_NAME,
  GENERATED_APP_BASE_IMAGE_BUILD_ARG,
  BUILD_DOCKER_IMAGE_STEP_START_LOG,
  BUILD_DOCKER_IMAGE_STEP_RUNNING_LOG
} from './build.service';
import { PrismaService } from 'nestjs-prisma';
import { StorageService } from '@codebrew/nestjs-storage';
import { SortOrder } from '@prisma/client';
import * as winston from 'winston';
import semver from 'semver';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import * as DataServiceGenerator from 'amplication-data-service-generator';
import { ContainerBuilderService } from 'amplication-container-builder/dist/nestjs';
import { EntityService } from '..';
import { AppRoleService } from '../appRole/appRole.service';
import { ActionService } from '../action/action.service';
import { EnumActionStepStatus } from '../action/dto/EnumActionStepStatus';
import { BackgroundService } from '../background/background.service';
import { LocalDiskService } from '../storage/local.disk.service';
import { Build } from './dto/Build';
import { getBuildTarGzFilePath, getBuildZipFilePath } from './storage';
import { FindOneBuildArgs } from './dto/FindOneBuildArgs';
import { CreateGeneratedAppDTO } from './dto/CreateGeneratedAppDTO';
import { BuildNotFoundError } from './errors/BuildNotFoundError';
import { BuildNotCompleteError } from './errors/BuildNotCompleteError';
import { BuildResultNotFound } from './errors/BuildResultNotFound';
import { ConfigService } from '@nestjs/config';
import { DeploymentService } from '../deployment/deployment.service';
import {
  BuildResult,
  EnumBuildStatus as ContainerBuildStatus
} from 'amplication-container-builder/dist/';

jest.mock('winston');
jest.mock('amplication-data-service-generator');
jest.mock('semver');

const winstonConsoleTransportOnMock = jest.fn();
const MOCK_CONSOLE_TRANSPORT = {
  on: winstonConsoleTransportOnMock
};
const winstonLoggerDestroyMock = jest.fn();
const MOCK_LOGGER = {
  destroy: winstonLoggerDestroyMock
};
const EXAMPLE_BUILD_ID = 'ExampleBuildId';
const EXAMPLE_USER_ID = 'ExampleUserId';
const EXAMPLE_ENTITY_VERSION_ID = 'ExampleEntityVersionId';
const EXAMPLE_APP_ID = 'ExampleAppId';
const NEW_VERSION_NUMBER = '1.0.1';
const EXAMPLE_INVALID_VERSION_NUMBER = 'exampleInvalidVersionNumber';
const EXAMPLE_SMALL_VERSION_NUMBER = '0.0.1';
const EXAMPLE_BUILD: Build = {
  id: EXAMPLE_BUILD_ID,
  createdAt: new Date(),
  userId: EXAMPLE_USER_ID,
  appId: EXAMPLE_APP_ID,
  version: '1.0.0',
  message: 'new build',
  actionId: 'ExampleActionId'
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
  }
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
  }
};

const prismaBuildCreateMock = jest.fn(() => EXAMPLE_BUILD);

const prismaBuildFindOneMock = jest.fn((args: FindOneBuildArgs) => {
  switch (args.where.id) {
    case EXAMPLE_BUILD_ID:
      return EXAMPLE_BUILD;
    case EXAMPLE_COMPLETED_BUILD.id:
      return EXAMPLE_COMPLETED_BUILD;
    case EXAMPLE_FAILED_BUILD.id:
      return EXAMPLE_FAILED_BUILD;
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

const appRoleServiceGetAppRolesMock = jest.fn(() => EXAMPLE_APP_ROLES);

const EXAMPLE_MODULES = [];

const EXAMPLE_ACTION_STEP = {
  id: 'EXAMPLE_ACTION_STEP_ID'
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
const backgroundServiceQueueMock = jest.fn(async () => {
  return;
});

const EXAMPLE_IMAGES = ['EXAMPLE_IMAGE_ID'];

const EXAMPLE_DOCKER_BUILD_RESULT_COMPLETED: BuildResult = {
  status: ContainerBuildStatus.Completed,
  images: EXAMPLE_IMAGES
};
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
const EXAMPLE_CREATE_GENERATED_APP_DTO: CreateGeneratedAppDTO = {
  buildId: EXAMPLE_BUILD_ID
};

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
          provide: ActionService,
          useValue: {
            run: actionServiceRunMock,
            logInfo: actionServiceLogInfoMock
          }
        },
        {
          provide: BackgroundService,
          useValue: {
            queue: backgroundServiceQueueMock
          }
        },
        {
          provide: ContainerBuilderService,
          useValue: {
            build: containerBuilderServiceBuildMock
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

  test('create build', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    //@ts-ignore
    semver.valid.mockImplementation(() => {
      return '1.0.1';
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    //@ts-ignore
    semver.gt.mockImplementation(() => {
      return true;
    });
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
        version: NEW_VERSION_NUMBER,
        message: EXAMPLE_BUILD.message,
        action: {
          create: {
            steps: {
              create: createInitialStepData(
                NEW_VERSION_NUMBER,
                EXAMPLE_BUILD.message
              )
            }
          } //create action record
        }
      }
    };
    const semverValidArgs = args.data.version;
    const semverGtArgs = {
      dataVersion: args.data.version,
      buildVersion: EXAMPLE_BUILD.version
    };
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
        createdAt: expect.any(Date),
        entityVersions: {
          connect: [{ id: EXAMPLE_ENTITY_VERSION_ID }]
        },
        blockVersions: {
          connect: []
        },
        action: {
          create: {
            steps: {
              create: {
                ...args.data.action.create.steps.create,
                completedAt: expect.any(Date)
              }
            }
          } //create action record
        }
      }
    });
    expect(backgroundServiceQueueMock).toBeCalledTimes(1);
    expect(backgroundServiceQueueMock).toBeCalledWith(
      CREATE_GENERATED_APP_PATH,
      EXAMPLE_CREATE_GENERATED_APP_DTO
    );
    expect(semver.valid).toBeCalledTimes(1);
    expect(semver.valid).toBeCalledWith(semverValidArgs);
    expect(semver.gt).toBeCalledTimes(1);
    expect(semver.gt).toBeCalledWith(
      semverGtArgs.dataVersion,
      semverGtArgs.buildVersion
    );
  });

  test('should throw a DataConflictError invalid version number', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    //@ts-ignore
    semver.valid.mockImplementation(() => {
      return null;
    });
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
        version: EXAMPLE_INVALID_VERSION_NUMBER,
        message: EXAMPLE_BUILD.message,
        action: {
          create: {
            steps: {
              create: createInitialStepData(
                EXAMPLE_INVALID_VERSION_NUMBER,
                EXAMPLE_BUILD.message
              )
            }
          } //create action record
        }
      }
    };
    const semverArgs = args.data.version;
    expect(service.create(args)).rejects.toThrow('Invalid version number');
    expect(semver.valid).toBeCalledTimes(1);
    expect(semver.valid).toBeCalledWith(semverArgs);
  });

  test('should throw a DataConflictError when new version number is not larger than the last', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    //@ts-ignore
    semver.gt.mockImplementation(() => false);
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    //@ts-ignore
    semver.valid.mockImplementation(() => true);
    const NEW_ERROR = `The new version number must be larger than the last version number (>${EXAMPLE_BUILD.version})`;
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
        version: EXAMPLE_SMALL_VERSION_NUMBER,
        message: EXAMPLE_BUILD.message,
        action: {
          create: {
            steps: {
              create: createInitialStepData(
                EXAMPLE_SMALL_VERSION_NUMBER,
                EXAMPLE_BUILD.message
              )
            }
          } //create action record
        }
      }
    };
    const findManyArgs = {
      where: {
        appId: EXAMPLE_APP_ID
      },
      orderBy: {
        createdAt: SortOrder.desc
      },
      take: 1
    };
    const semverArgs = {
      dataVersion: args.data.version,
      buildVersion: EXAMPLE_BUILD.version
    };
    const semverValidArgs = args.data.version;
    await expect(service.create(args)).rejects.toThrow(NEW_ERROR);
    expect(prismaBuildFindManyMock).toBeCalledTimes(1);
    expect(prismaBuildFindManyMock).toBeCalledWith(findManyArgs);
    expect(semver.gt).toBeCalledTimes(1);
    expect(semver.gt).toBeCalledWith(
      semverArgs.dataVersion,
      semverArgs.buildVersion
    );
    expect(semver.valid).toBeCalledTimes(1);
    expect(semver.valid).toBeCalledWith(semverValidArgs);
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
    await expect(service.getDeployments(EXAMPLE_BUILD_ID));
    expect(deploymentFindManyMock).toBeCalledTimes(1);
    expect(deploymentFindManyMock).toBeCalledWith({
      where: {
        build: {
          id: EXAMPLE_BUILD_ID
        }
      }
    });
  });

  test('builds app', async () => {
    // eslint-disable-next-line
    // @ts-ignore
    winston.createLogger.mockImplementation(() => MOCK_LOGGER);
    // eslint-disable-next-line
    // @ts-ignore
    winston.transports.Console = jest.fn(() => MOCK_CONSOLE_TRANSPORT);
    // eslint-disable-next-line
    // @ts-ignore
    DataServiceGenerator.createDataService.mockImplementation(
      () => EXAMPLE_MODULES
    );
    expect(await service.build(EXAMPLE_BUILD_ID)).toBeUndefined();
    expect(prismaBuildFindOneMock).toBeCalledTimes(1);
    expect(prismaBuildFindOneMock).toBeCalledWith({
      where: { id: EXAMPLE_BUILD_ID }
    });
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
  });

  test('should catch an error when trying to build', async () => {
    const EXAMPLE_ERROR = new Error('ExampleError');

    // eslint-disable-next-line
    // @ts-ignore
    winston.createLogger.mockImplementation(() => MOCK_LOGGER);
    // eslint-disable-next-line
    // @ts-ignore
    winston.transports.Console = jest.fn(() => MOCK_CONSOLE_TRANSPORT);
    // eslint-disable-next-line
    // @ts-ignore
    DataServiceGenerator.createDataService.mockImplementation(() => {
      throw EXAMPLE_ERROR;
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    loggerChildErrorMock.mockImplementation((error: Error) => {
      return;
    });
    const buildId = EXAMPLE_BUILD_ID;
    expect(await service.build(buildId)).toBeUndefined();
    expect(prismaBuildFindOneMock).toBeCalledTimes(1);
    expect(prismaBuildFindOneMock).toBeCalledWith({
      where: { id: buildId }
    });
    expect(loggerChildMock).toBeCalledTimes(1);
    expect(loggerChildMock).toBeCalledWith({
      buildId: buildId
    });
    expect(loggerChildInfoMock).toBeCalledTimes(2);
    expect(loggerChildInfoMock.mock.calls).toEqual([
      [JOB_STARTED_LOG],
      [JOB_DONE_LOG]
    ]);
    expect(loggerChildErrorMock).toBeCalledTimes(1);
    expect(loggerChildErrorMock).toBeCalledWith(EXAMPLE_ERROR);
    expect(actionServiceRunMock).toBeCalledTimes(1);
    expect(actionServiceRunMock).toBeCalledWith(
      EXAMPLE_BUILD.actionId,
      GENERATE_STEP_NAME,
      GENERATE_STEP_MESSAGE,
      expect.any(Function)
    );
  });
});
