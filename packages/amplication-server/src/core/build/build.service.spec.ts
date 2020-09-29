import { Test, TestingModule } from '@nestjs/testing';
import { Readable } from 'stream';
import {
  ACTION_JOB_DONE_LOG,
  GENERATE_STEP_MESSAGE,
  ACTION_ZIP_LOG,
  BuildService,
  createInitialStepData,
  CREATE_GENERATED_APP_PATH,
  ENTITIES_INCLUDE,
  JOB_DONE_LOG,
  JOB_STARTED_LOG
} from './build.service';
import { PrismaService } from 'nestjs-prisma';
import { StorageService } from '@codebrew/nestjs-storage';
import { EnumBuildStatus, SortOrder } from '@prisma/client';
import * as winston from 'winston';
import * as DataServiceGenerator from 'amplication-data-service-generator';
import { Build } from './dto/Build';
import { FindOneBuildArgs } from './dto/FindOneBuildArgs';
import { getBuildFilePath } from './storage';
import { BuildNotFoundError } from './errors/BuildNotFoundError';
import { BuildNotCompleteError } from './errors/BuildNotCompleteError';
import { EntityService } from '..';
import { BuildResultNotFound } from './errors/BuildResultNotFound';
import { AppRoleService } from '../appRole/appRole.service';
import { ActionService } from '../action/action.service';
import { BackgroundService } from '../background/background.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { CreateGeneratedAppDTO } from './dto/CreateGeneratedAppDTO';
import { EnumActionStepStatus } from '../action/dto/EnumActionStepStatus';
import { EnumActionLogLevel } from 'amplication-data/dist/models';
import semver from 'semver';

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
  status: EnumBuildStatus.Waiting,
  createdAt: new Date(),
  userId: EXAMPLE_USER_ID,
  appId: EXAMPLE_APP_ID,
  version: '1.0.0',
  message: 'new build',
  actionId: 'ExampleActionId'
};
const EXAMPLE_COMPLETED_BUILD: Build = {
  id: 'ExampleSuccessfulBuild',
  status: EnumBuildStatus.Completed,
  createdAt: new Date(),
  userId: EXAMPLE_USER_ID,
  appId: EXAMPLE_APP_ID,
  version: '1.0.0',
  message: 'new build',
  actionId: 'ExampleActionId'
};
const EXAMPLE_FAILED_BUILD: Build = {
  id: 'ExampleFailedBuild',
  status: EnumBuildStatus.Failed,
  createdAt: new Date(),
  userId: EXAMPLE_USER_ID,
  appId: EXAMPLE_APP_ID,
  version: '1.0.0',
  message: 'new build',
  actionId: 'ExampleActionId'
};

const createMock = jest.fn(() => EXAMPLE_BUILD);

const findOneMock = jest.fn((args: FindOneBuildArgs) => {
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

const findManyMock = jest.fn(() => {
  return [EXAMPLE_BUILD];
});

const updateMock = jest.fn();

const getLatestVersionsMock = jest.fn(() => {
  return [{ id: EXAMPLE_ENTITY_VERSION_ID }];
});

const EXAMPLE_ENTITIES = [];

const getEntitiesByVersionsMock = jest.fn(() => EXAMPLE_ENTITIES);

const EXAMPLE_APP_ROLES = [];

const getAppRolesMock = jest.fn(() => EXAMPLE_APP_ROLES);

const EXAMPLE_MODULES = [];

const EXAMPLE_ACTION_STEP = {
  id: 'EXAMPLE_ACTION_STEP_ID'
};

const actionServiceCreateStepMock = jest.fn(() => EXAMPLE_ACTION_STEP);
const actionServiceLogInfoMock = jest.fn();
const actionServiceCompleteMock = jest.fn();
const actionServiceLogMock = jest.fn();
const backgroundServiceQueue = jest.fn(async () => {
  return;
});

const EXAMPLE_STREAM = new Readable();

const existsMock = jest.fn(() => ({ exists: true }));
const getStreamMock = jest.fn(() => EXAMPLE_STREAM);
const putMock = jest.fn();

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
          provide: PrismaService,
          useValue: {
            build: {
              create: createMock,
              findMany: findManyMock,
              findOne: findOneMock,
              update: updateMock
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
                exists: existsMock,
                getStream: getStreamMock,
                put: putMock
              };
            }
          }
        },
        {
          provide: EntityService,
          useValue: {
            getLatestVersions: getLatestVersionsMock,
            getEntitiesByVersions: getEntitiesByVersionsMock
          }
        },
        {
          provide: AppRoleService,
          useValue: {
            getAppRoles: getAppRolesMock
          }
        },
        {
          provide: ActionService,
          useValue: {
            createStep: actionServiceCreateStepMock,
            logInfo: actionServiceLogInfoMock,
            complete: actionServiceCompleteMock,
            log: actionServiceLogMock
          }
        },
        {
          provide: BackgroundService,
          useValue: {
            queue: backgroundServiceQueue
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
    expect(getLatestVersionsMock).toBeCalledTimes(1);
    expect(getLatestVersionsMock).toBeCalledWith({
      where: { app: { id: EXAMPLE_APP_ID } }
    });
    expect(createMock).toBeCalledTimes(1);
    expect(createMock).toBeCalledWith({
      ...args,
      data: {
        ...args.data,
        status: EnumBuildStatus.Waiting,
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
    expect(backgroundServiceQueue).toBeCalledTimes(1);
    expect(backgroundServiceQueue).toBeCalledWith(
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
    semver.gt.mockImplementation(() => {
      return false;
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    //@ts-ignore
    semver.valid.mockImplementation(() => {
      return '1.0.1';
    });
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
    expect(findManyMock).toBeCalledTimes(1);
    expect(findManyMock).toBeCalledWith(findManyArgs);
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
    expect(findManyMock).toBeCalledTimes(1);
    expect(findManyMock).toBeCalledWith(args);
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
    expect(findOneMock).toBeCalledTimes(1);
    expect(findOneMock).toBeCalledWith(args);
    const buildFilePath = getBuildFilePath(EXAMPLE_COMPLETED_BUILD.id);
    expect(existsMock).toBeCalledTimes(1);
    expect(existsMock).toBeCalledWith(buildFilePath);
    expect(getStreamMock).toBeCalledTimes(1);
    expect(getStreamMock).toBeCalledWith(buildFilePath);
  });

  test('fail to create download stream for a non existing build', async () => {
    const args: FindOneBuildArgs = {
      where: {
        id: 'nonExistingId'
      }
    };
    await expect(service.download(args)).rejects.toThrow(BuildNotFoundError);
    expect(findOneMock).toBeCalledTimes(1);
    expect(findOneMock).toBeCalledWith(args);
    expect(existsMock).toBeCalledTimes(0);
    expect(getStreamMock).toBeCalledTimes(0);
  });

  test('fail to create download stream for a not finished build', async () => {
    const args: FindOneBuildArgs = {
      where: {
        id: EXAMPLE_BUILD_ID
      }
    };
    await expect(service.download(args)).rejects.toThrow(BuildNotCompleteError);
    expect(findOneMock).toBeCalledTimes(1);
    expect(findOneMock).toBeCalledWith(args);
    expect(existsMock).toBeCalledTimes(0);
    expect(getStreamMock).toBeCalledTimes(0);
  });

  test('fail to create download stream for non existing build result', async () => {
    const args: FindOneBuildArgs = {
      where: {
        id: EXAMPLE_COMPLETED_BUILD.id
      }
    };
    existsMock.mockImplementation(() => ({ exists: false }));
    await expect(service.download(args)).rejects.toThrow(BuildResultNotFound);
    expect(findOneMock).toBeCalledTimes(1);
    expect(findOneMock).toBeCalledWith(args);
    expect(existsMock).toBeCalledTimes(1);
    expect(existsMock).toBeCalledWith(
      getBuildFilePath(EXAMPLE_COMPLETED_BUILD.id)
    );
    expect(getStreamMock).toBeCalledTimes(0);
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
    expect(findOneMock).toBeCalledTimes(1);
    expect(findOneMock).toBeCalledWith({
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
    expect(updateMock).toBeCalledTimes(2);
    expect(updateMock.mock.calls).toEqual([
      [
        {
          where: { id: EXAMPLE_BUILD_ID },
          data: {
            status: EnumBuildStatus.Active
          }
        }
      ],
      [
        {
          where: { id: EXAMPLE_BUILD_ID },
          data: {
            status: EnumBuildStatus.Completed
          }
        }
      ]
    ]);
    expect(actionServiceCreateStepMock).toBeCalledTimes(1);
    expect(actionServiceCreateStepMock).toBeCalledWith(
      EXAMPLE_BUILD.actionId,
      GENERATE_STEP_MESSAGE
    );
    expect(getEntitiesByVersionsMock).toBeCalledTimes(1);
    expect(getEntitiesByVersionsMock).toBeCalledWith({
      where: {
        builds: {
          some: {
            id: EXAMPLE_BUILD_ID
          }
        }
      },
      include: ENTITIES_INCLUDE
    });
    expect(getAppRolesMock).toBeCalledTimes(1);
    expect(getAppRolesMock).toBeCalledWith({
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
    expect(actionServiceLogInfoMock).toBeCalledTimes(2);
    expect(actionServiceLogInfoMock.mock.calls).toEqual([
      [EXAMPLE_ACTION_STEP, ACTION_ZIP_LOG],
      [EXAMPLE_ACTION_STEP, ACTION_JOB_DONE_LOG]
    ]);
    expect(actionServiceCompleteMock).toBeCalledTimes(1);
    expect(actionServiceCompleteMock).toBeCalledWith(
      EXAMPLE_ACTION_STEP,
      EnumActionStepStatus.Success
    );
    expect(actionServiceLogMock).toBeCalledTimes(0);
  });

  test('should catch an error when trying to build', async () => {
    const EXAMPLE_ERROR = new Error('ExampleError');
    const logArgs = {
      step: EXAMPLE_ACTION_STEP,
      enumError: EnumActionLogLevel.Error,
      error: EXAMPLE_ERROR
    };
    const completeArgs = {
      step: EXAMPLE_ACTION_STEP,
      enumStatus: EnumActionStepStatus.Failed
    };
    const activeStatus = EnumBuildStatus.Active;
    const failStatus = EnumBuildStatus.Failed;
    const tryUpdateArgs = {
      where: { id: EXAMPLE_BUILD_ID },
      data: { status: activeStatus }
    };
    const catchUpdateArgs = {
      where: { id: EXAMPLE_BUILD_ID },
      data: { status: failStatus }
    };
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
    expect(findOneMock).toBeCalledTimes(1);
    expect(findOneMock).toBeCalledWith({
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
    expect(actionServiceLogMock).toBeCalledTimes(1);
    expect(actionServiceLogMock).toBeCalledWith(
      logArgs.step,
      logArgs.enumError,
      logArgs.error
    );
    expect(actionServiceCompleteMock).toBeCalledTimes(1);
    expect(actionServiceCompleteMock).toBeCalledWith(
      completeArgs.step,
      completeArgs.enumStatus
    );
    expect(updateMock).toBeCalledTimes(2);
    expect(updateMock.mock.calls).toEqual([[tryUpdateArgs], [catchUpdateArgs]]);
  });
});
