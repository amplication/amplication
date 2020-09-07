import { Test, TestingModule } from '@nestjs/testing';
import { getQueueToken } from '@nestjs/bull';
import { Readable } from 'stream';
import { BuildService } from './build.service';
import { QUEUE_NAME } from './constants';
import { PrismaService } from 'nestjs-prisma';
import { StorageService } from '@codebrew/nestjs-storage';
import { EnumBuildStatus } from '@prisma/client';
import { Build } from './dto/Build';
import { FindOneBuildArgs } from './dto/FindOneBuildArgs';
import { getBuildFilePath } from './storage';
import { BuildNotFoundError } from './errors/BuildNotFoundError';
import { BuildNotCompleteError } from './errors/BuildNotCompleteError';
import { EntityService } from '..';
import { BuildResultNotFound } from './errors/BuildResultNotFound';
import { AppRoleService } from '../appRole/appRole.service';

const EXAMPLE_BUILD_ID = 'ExampleBuildId';
const EXAMPLE_USER_ID = 'ExampleUserId';
const EXAMPLE_ENTITY_VERSION_ID = 'ExampleEntityVersionId';
const EXAMPLE_APP_ID = 'ExampleAppId';
const EXAMPLE_BUILD: Build = {
  id: EXAMPLE_BUILD_ID,
  status: EnumBuildStatus.Waiting,
  createdAt: new Date(),
  userId: EXAMPLE_USER_ID,
  appId: EXAMPLE_APP_ID
};
const EXAMPLE_COMPLETED_BUILD: Build = {
  id: 'ExampleSuccessfulBuild',
  status: EnumBuildStatus.Completed,
  createdAt: new Date(),
  userId: EXAMPLE_USER_ID,
  appId: EXAMPLE_APP_ID
};
const EXAMPLE_FAILED_BUILD: Build = {
  id: 'ExampleFailedBuild',
  status: EnumBuildStatus.Failed,
  createdAt: new Date(),
  userId: EXAMPLE_USER_ID,
  appId: EXAMPLE_APP_ID
};

const addMock = jest.fn(() => {
  return;
});

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

const getLatestVersionsMock = jest.fn(() => {
  return [{ id: EXAMPLE_ENTITY_VERSION_ID }];
});

const EXAMPLE_STREAM = new Readable();

const existsMock = jest.fn(() => ({ exists: true }));
const getStreamMock = jest.fn(() => EXAMPLE_STREAM);

const getAppRolesMock = jest.fn(() => []);

describe('BuildService', () => {
  let service: BuildService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BuildService,
        {
          provide: getQueueToken(QUEUE_NAME),
          useValue: {
            add: addMock
          }
        },
        {
          provide: PrismaService,
          useValue: {
            build: {
              create: createMock,
              findMany: findManyMock,
              findOne: findOneMock
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
                getStream: getStreamMock
              };
            }
          }
        },
        {
          provide: EntityService,
          useValue: {
            getLatestVersions: getLatestVersionsMock
          }
        },
        {
          provide: AppRoleService,
          useValue: {
            getAppRoles: getAppRolesMock
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
        }
      }
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
        }
      }
    });
    expect(addMock).toBeCalledTimes(1);
    expect(addMock).toBeCalledWith({ id: EXAMPLE_BUILD_ID });
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
});
