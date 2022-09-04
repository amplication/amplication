import { Readable } from 'stream';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';
import { EnumResourceType, PrismaService } from '@amplication/prisma-db';
import { StorageService } from '@codebrew/nestjs-storage';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { orderBy } from 'lodash';
import {
  ACTION_JOB_DONE_LOG,
  GENERATE_STEP_MESSAGE,
  GENERATE_STEP_NAME,
  ACTION_ZIP_LOG,
  BuildService,
  ENTITIES_INCLUDE,
  ACTION_INCLUDE
} from './build.service';
import * as DataServiceGenerator from '@amplication/data-service-generator';
import { EntityService } from '..';
import { ResourceRoleService } from '../resourceRole/resourceRole.service';
import { ResourceService } from '../resource/resource.service';
import { ActionService } from '../action/action.service';
import { LocalDiskService } from '../storage/local.disk.service';
import { Build } from './dto/Build';
import { getBuildTarGzFilePath, getBuildZipFilePath } from './storage';
import { FindOneBuildArgs } from './dto/FindOneBuildArgs';
import { BuildNotFoundError } from './errors/BuildNotFoundError';
import { UserService } from '../user/user.service';
import { QueueService } from '../queue/queue.service';
import { EnumBuildStatus } from 'src/core/build/dto/EnumBuildStatus';
import { Resource, Commit, Entity } from 'src/models';
import {
  ActionStep,
  EnumActionLogLevel,
  EnumActionStepStatus
} from '../action/dto';
import { BuildFilesSaver } from './utils/BuildFilesSaver';
import { GitService } from '@amplication/git-service/';
import { EnumAuthProviderType } from '../serviceSettings/dto/EnumAuthenticationProviderType';
import { ServiceSettingsValues } from '../serviceSettings/constants';
import { ServiceSettingsService } from '../serviceSettings/serviceSettings.service';
import { EXAMPLE_GIT_ORGANIZATION } from '../git/__mocks__/GitOrganization.mock';

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
const EXAMPLE_RESOURCE_ID = 'exampleResourceId';
export const EXAMPLE_DATE = new Date('2020-01-01');

const JOB_STARTED_LOG = 'Build job started';
const JOB_DONE_LOG = 'Build job done';

const EXAMPLE_MESSAGE = 'exampleMessage';

const EXAMPLE_APP_SETTINGS_VALUES: ServiceSettingsValues = {
  dbHost: 'localhost',
  dbName: 'myDb',
  dbPassword: '1234',
  dbPort: 5432,
  dbUser: 'admin',
  resourceId: EXAMPLE_RESOURCE_ID,
  authProvider: EnumAuthProviderType.Http,
  serverSettings: {
    generateGraphQL: true,
    generateRestApi: true,
    serverPath: ''
  },
  adminUISettings: {
    generateAdminUI: true,
    adminUIPath: ''
  }
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

const EXAMPLE_ACTION = {
  id: 'ExampleActionId',
  createdAt: new Date(),
  steps: [EXAMPLE_GENERATE_STEP]
};
const EXAMPLE_BUILD: Build = {
  id: EXAMPLE_BUILD_ID,
  createdAt: EXAMPLE_DATE,
  userId: EXAMPLE_USER_ID,
  resourceId: EXAMPLE_RESOURCE_ID,
  version: '1.0.0',
  message: 'new build',
  actionId: EXAMPLE_ACTION.id,
  commitId: EXAMPLE_COMMIT_ID,
  action: EXAMPLE_ACTION
};

const EXAMPLE_COMPLETED_BUILD: Build = {
  ...EXAMPLE_BUILD,
  id: 'ExampleSuccessfulBuild',
  action: {
    id: 'ExampleSuccessfulBuildAction',
    createdAt: new Date(),
    steps: [EXAMPLE_COMPLETED_GENERATE_STEP]
  }
};
const EXAMPLE_RUNNING_BUILD: Build = {
  ...EXAMPLE_BUILD,
  id: 'ExampleRunningBuild'
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

const EXAMPLE_INVALID_BUILD: Build = {
  ...EXAMPLE_BUILD,
  id: 'ExampleInvalidBuild',
  action: undefined
};

const EXAMPLE_USER = {
  id: EXAMPLE_USER_ID
};

const EXAMPLE_APP_ROLES = [];

const EXAMPLE_SERVICE_RESOURCE: Resource = {
  id: 'exampleResourceId',
  resourceType: EnumResourceType.Service,
  createdAt: new Date(),
  updatedAt: new Date(),
  name: 'exampleResourceName',
  description: 'example Resources Description',
  gitRepositoryOverride: false
};

const EXAMPLE_BUILD_INCLUDE_RESOURCE_AND_COMMIT: Build = {
  ...EXAMPLE_BUILD,
  commit: EXAMPLE_COMMIT,
  resource: EXAMPLE_SERVICE_RESOURCE
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
  () => EXAMPLE_BUILD_INCLUDE_RESOURCE_AND_COMMIT
);

const prismaBuildFindOneMock = jest.fn();

const prismaBuildFindManyMock = jest.fn(() => {
  return [EXAMPLE_BUILD];
});

const entityServiceGetLatestVersionsMock = jest.fn(() => {
  return [{ id: EXAMPLE_ENTITY_VERSION_ID }];
});

const prismaGitRepositoryReturnNull = jest.fn(() => null);

const EXAMPLE_FIRST_ENTITY_NAME = 'AA First Entity';
const EXAMPLE_SECOND_ENTITY_NAME = 'BB second Entity';

const EXAMPLE_ENTITIES: Entity[] = [
  {
    id: 'EXAMPLE_SECOND_ID',
    createdAt: new Date('2020-02-17 18:20:20'),
    updatedAt: new Date(),
    resourceId: 'exampleResourceId',
    name: EXAMPLE_SECOND_ENTITY_NAME,
    displayName: 'Second entity',
    pluralDisplayName: 'Second entity plural display name'
  },
  {
    id: 'EXAMPLE_FIRST_ID',
    createdAt: new Date('2020-02-10 18:20:20'), //created first
    updatedAt: new Date(),
    resourceId: 'exampleResourceId',
    name: EXAMPLE_FIRST_ENTITY_NAME,
    displayName: 'First entity',
    pluralDisplayName: 'First entity plural display name'
  }
];

const entityServiceGetEntitiesByVersionsMock = jest.fn(() => EXAMPLE_ENTITIES);

const resourceRoleServiceGetResourceRolesMock = jest.fn(
  () => EXAMPLE_APP_ROLES
);

const resourceServiceGetResourceMock = jest.fn(() => EXAMPLE_SERVICE_RESOURCE);

const EXAMPLE_ACTION_STEP: ActionStep = {
  id: 'EXAMPLE_ACTION_STEP_ID',
  name: 'EXAMPLE_ACTION_STEP_NAME',
  createdAt: new Date(),
  message: 'EXAMPLE_ACTION_STEP_MESSAGE',
  status: EnumActionStepStatus.Running
};

const actionServiceRunMock = jest.fn(
  async (
    actionId: string,
    stepName: string,
    message: string,
    stepFunction: (step: { id: string }) => Promise<any>
  ) => {
    return stepFunction(EXAMPLE_ACTION_STEP);
  }
);
const actionServiceLogInfoMock = jest.fn();
const actionServiceLogMock = jest.fn();

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
const loggerInfoMock = jest.fn(error => {
  // Write the error to console so it will be visible for who runs the test
  console.log(error);
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

const actionServiceCompleteMock = jest.fn(() => ({}));

const userServiceFindUserMock = jest.fn(() => EXAMPLE_USER);

const getServiceSettingsValuesMock = jest.fn(() => EXAMPLE_APP_SETTINGS_VALUES);

const getGitRepository = jest.fn(() => null);
const getGitOrganization = jest.fn(() => EXAMPLE_GIT_ORGANIZATION);

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
              findUnique: prismaBuildFindOneMock
            },
            gitRepository: {
              findUnique: prismaGitRepositoryReturnNull
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
          provide: ResourceRoleService,
          useValue: {
            getResourceRoles: resourceRoleServiceGetResourceRolesMock
          }
        },
        {
          provide: ResourceService,
          useValue: {
            resource: resourceServiceGetResourceMock,
            gitRepository: getGitRepository,
            gitOrganizationByResource: getGitOrganization
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
          provide: LocalDiskService,
          useValue: {
            getDisk: localDiskServiceGetDiskMock
          }
        },
        {
          provide: UserService,
          useValue: {
            findUser: userServiceFindUserMock
          }
        },
        {
          provide: ServiceSettingsService,
          useValue: {
            getServiceSettingsValues: getServiceSettingsValuesMock
          }
        },
        {
          provide: GitService,
          useValue: {}
        },
        {
          provide: WINSTON_MODULE_PROVIDER,
          useValue: {
            error: loggerErrorMock,
            child: loggerChildMock,
            info: loggerInfoMock,
            format: EXAMPLE_LOGGER_FORMAT
          }
        },
        {
          provide: BuildFilesSaver,
          useClass: BuildFilesSaver
        },
        {
          provide: QueueService,
          useValue: {
            emitCreateGitPullRequest: () => ({ url: 'http://url.com' })
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
        resource: {
          connect: {
            id: EXAMPLE_RESOURCE_ID
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
      EXAMPLE_BUILD_INCLUDE_RESOURCE_AND_COMMIT
    );
    expect(entityServiceGetLatestVersionsMock).toBeCalledTimes(1);
    expect(entityServiceGetLatestVersionsMock).toBeCalledWith({
      where: { resource: { id: EXAMPLE_RESOURCE_ID } }
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
        resource: true
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

    expect(resourceServiceGetResourceMock).toBeCalledTimes(1);
    expect(resourceServiceGetResourceMock).toBeCalledWith({
      where: { id: EXAMPLE_RESOURCE_ID }
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
    expect(resourceRoleServiceGetResourceRolesMock).toBeCalledTimes(1);
    expect(resourceRoleServiceGetResourceRolesMock).toBeCalledWith({
      where: {
        resource: {
          id: EXAMPLE_RESOURCE_ID
        }
      }
    });
    expect(DataServiceGenerator.createDataService).toBeCalledTimes(1);
    expect(DataServiceGenerator.createDataService).toBeCalledWith(
      orderBy(EXAMPLE_ENTITIES, entity => entity.createdAt),
      EXAMPLE_APP_ROLES,
      {
        name: EXAMPLE_SERVICE_RESOURCE.name,
        description: EXAMPLE_SERVICE_RESOURCE.description,
        version: EXAMPLE_BUILD.version,
        id: EXAMPLE_SERVICE_RESOURCE.id,
        url: `${EXAMPLED_HOST}/${EXAMPLE_SERVICE_RESOURCE.id}`,
        settings: EXAMPLE_APP_SETTINGS_VALUES
      },
      MOCK_LOGGER
    );
    expect(winstonLoggerDestroyMock).toBeCalledTimes(1);
    expect(winstonLoggerDestroyMock).toBeCalledWith();
    expect(actionServiceRunMock).toBeCalledTimes(1);
    expect(actionServiceRunMock.mock.calls).toEqual([
      [
        EXAMPLE_BUILD.actionId,
        GENERATE_STEP_NAME,
        GENERATE_STEP_MESSAGE,
        expect.any(Function)
      ]
    ]);
    expect(actionServiceLogInfoMock).toBeCalledTimes(2);
    expect(actionServiceLogInfoMock.mock.calls).toEqual([
      [EXAMPLE_ACTION_STEP, ACTION_ZIP_LOG],
      [EXAMPLE_ACTION_STEP, ACTION_JOB_DONE_LOG]
    ]);
    expect(actionServiceLogMock).toBeCalledTimes(0);
    expect(storageServiceDiskGetUrlMock).toBeCalledTimes(1);
    expect(storageServiceDiskGetUrlMock).toBeCalledWith(
      getBuildTarGzFilePath(EXAMPLE_BUILD.id)
    );
    expect(localDiskServiceGetDiskMock).toBeCalledTimes(0);
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
    const findOneArgs = {
      where: { id: EXAMPLE_BUILD_ID },
      include: ACTION_INCLUDE
    };
    expect(await service.calcBuildStatus(EXAMPLE_BUILD_ID)).toEqual(
      EnumBuildStatus.Completed
    );
    expect(prismaBuildFindOneMock).toBeCalledTimes(1);
    expect(prismaBuildFindOneMock).toBeCalledWith(findOneArgs);
  });
});
