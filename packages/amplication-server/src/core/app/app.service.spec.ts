import { Test, TestingModule } from '@nestjs/testing';
import cuid from 'cuid';
import {
  AppService,
  DEFAULT_APP_COLOR,
  DEFAULT_ENVIRONMENT_NAME
} from './app.service';
import { PrismaService } from 'nestjs-prisma';
import { EntityService } from '../entity/entity.service';
import { App } from 'src/models/App';
import { User } from 'src/models/User';
import { Entity } from 'src/models/Entity';
import { PendingChange } from './dto/PendingChange';
import { EntityVersion, Commit } from 'src/models';
import { EnumPendingChangeAction, EnumPendingChangeResourceType } from './dto';

const EXAMPLE_MESSAGE = 'exampleMessage';
const EXAMPLE_APP_ID = 'exampleAppId';
const EXAMPLE_APP_NAME = 'exampleAppName';
const EXAMPLE_APP_DESCRIPTION = 'exampleAppName';

const EXAMPLE_CUID = 'EXAMPLE_CUID';

const EXAMPLE_APP: App = {
  id: EXAMPLE_APP_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  name: EXAMPLE_APP_NAME,
  color: DEFAULT_APP_COLOR,
  description: EXAMPLE_APP_DESCRIPTION
};

const EXAMPLE_USER_ID = 'exampleUserId';
const EXAMPLE_USER_APP_ROLE = {
  name: 'user',
  displayName: 'User'
};

const EXAMPLE_USER: User = {
  id: EXAMPLE_USER_ID,
  createdAt: new Date(),
  updatedAt: new Date()
};

const EXAMPLE_ENTITY_ID = 'exampleEntityId';
const EXAMPLE_ENTITY_NAME = 'exampleEntityName';
const EXAMPLE_ENTITY_DISPLAY_NAME = 'exampleEntityDisplayName';
const EXAMPLE_ENTITY_PLURAL_DISPLAY_NAME = 'exampleEntityPluralDisplayName';

const EXAMPLE_ENTITY: Entity = {
  id: EXAMPLE_ENTITY_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  appId: EXAMPLE_APP_ID,
  name: EXAMPLE_ENTITY_NAME,
  displayName: EXAMPLE_ENTITY_DISPLAY_NAME,
  pluralDisplayName: EXAMPLE_ENTITY_PLURAL_DISPLAY_NAME
};

const EXAMPLE_CHANGED_ENTITY: PendingChange = {
  resourceId: EXAMPLE_ENTITY_ID,
  action: EnumPendingChangeAction.Create,
  resourceType: EnumPendingChangeResourceType.Entity,
  versionNumber: 1,
  resource: EXAMPLE_ENTITY
};

const EXAMPLE_ENTITY_VERSION_ID = 'exampleEntityVersionId';
const EXAMPLE_VERSION_NUMBER = 0;

const EXAMPLE_ENTITY_VERSION: EntityVersion = {
  id: EXAMPLE_ENTITY_VERSION_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  entityId: EXAMPLE_ENTITY_ID,
  versionNumber: EXAMPLE_VERSION_NUMBER,
  name: EXAMPLE_ENTITY_NAME,
  displayName: EXAMPLE_ENTITY_DISPLAY_NAME,
  pluralDisplayName: EXAMPLE_ENTITY_PLURAL_DISPLAY_NAME
};

const EXAMPLE_COMMIT_ID = 'exampleCommitId';

const EXAMPLE_COMMIT: Commit = {
  id: EXAMPLE_COMMIT_ID,
  createdAt: new Date(),
  userId: EXAMPLE_USER_ID,
  message: EXAMPLE_MESSAGE
};

const prismaAppCreateMock = jest.fn(() => {
  return EXAMPLE_APP;
});
const prismaAppFindOneMock = jest.fn(() => {
  return EXAMPLE_APP;
});
const prismaAppFindManyMock = jest.fn(() => {
  return [EXAMPLE_APP];
});
const prismaAppDeleteMock = jest.fn(() => {
  return EXAMPLE_APP;
});
const prismaAppUpdateMock = jest.fn(() => {
  return EXAMPLE_APP;
});
const prismaEntityFindManyMock = jest.fn(() => {
  return [EXAMPLE_ENTITY];
});
const prismaCommitCreateMock = jest.fn(() => {
  return EXAMPLE_COMMIT;
});
const entityServiceCreateVersionMock = jest.fn(() => {
  return EXAMPLE_ENTITY_VERSION;
});
const entityServiceReleaseLockMock = jest.fn(() => {
  return EXAMPLE_ENTITY;
});

const entityServiceGetChangedEntitiesMock = jest.fn(() => {
  return [EXAMPLE_CHANGED_ENTITY];
});

const entityServiceCreateDefaultEntitiesMock = jest.fn(() => {
  return;
});

jest.mock('cuid');
// eslint-disable-next-line
// @ts-ignore
cuid.mockImplementation(() => EXAMPLE_CUID);

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: PrismaService,
          useClass: jest.fn().mockImplementation(() => ({
            app: {
              create: prismaAppCreateMock,
              findOne: prismaAppFindOneMock,
              findMany: prismaAppFindManyMock,
              delete: prismaAppDeleteMock,
              update: prismaAppUpdateMock
            },
            entity: {
              findMany: prismaEntityFindManyMock
            },
            commit: {
              create: prismaCommitCreateMock
            }
          }))
        },
        {
          provide: EntityService,
          useClass: jest.fn().mockImplementation(() => ({
            createVersion: entityServiceCreateVersionMock,
            releaseLock: entityServiceReleaseLockMock,
            createDefaultEntities: entityServiceCreateDefaultEntitiesMock,
            getChangedEntities: entityServiceGetChangedEntitiesMock
          }))
        }
      ]
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an app', async () => {
    const createAppArgs = {
      args: {
        data: {
          name: EXAMPLE_APP_NAME,
          description: EXAMPLE_APP_DESCRIPTION,
          color: DEFAULT_APP_COLOR
        }
      },
      user: EXAMPLE_USER
    };
    const returnArgs = {
      data: {
        ...createAppArgs.args.data,
        organization: {
          connect: {
            id: createAppArgs.user.organization?.id
          }
        },
        roles: {
          create: EXAMPLE_USER_APP_ROLE
        },
        environments: {
          create: {
            name: DEFAULT_ENVIRONMENT_NAME,
            address: cuid()
          }
        }
      }
    };
    expect(
      await service.createApp(createAppArgs.args, createAppArgs.user)
    ).toEqual(EXAMPLE_APP);
    expect(prismaAppCreateMock).toBeCalledTimes(1);
    expect(prismaAppCreateMock).toBeCalledWith(returnArgs);
    expect(entityServiceCreateDefaultEntitiesMock).toBeCalledTimes(1);
    expect(entityServiceCreateDefaultEntitiesMock).toBeCalledWith(
      EXAMPLE_APP_ID,
      EXAMPLE_USER
    );
  });

  it('should find an app', async () => {
    const args = { where: { id: EXAMPLE_APP_ID } };
    expect(await service.app(args)).toEqual(EXAMPLE_APP);
    expect(prismaAppFindOneMock).toBeCalledTimes(1);
    expect(prismaAppFindOneMock).toBeCalledWith(args);
  });

  it('should find many apps', async () => {
    const args = { where: { id: EXAMPLE_APP_ID } };
    expect(await service.apps(args)).toEqual([EXAMPLE_APP]);
    expect(prismaAppFindManyMock).toBeCalledTimes(1);
    expect(prismaAppFindManyMock).toBeCalledWith(args);
  });

  it('should delete an app', async () => {
    const args = { where: { id: EXAMPLE_APP_ID } };
    expect(await service.deleteApp(args)).toEqual(EXAMPLE_APP);
    expect(prismaAppDeleteMock).toBeCalledTimes(1);
    expect(prismaAppDeleteMock).toBeCalledWith(args);
  });

  it('should update an app', async () => {
    const args = {
      data: { name: EXAMPLE_APP_NAME },
      where: { id: EXAMPLE_APP_ID }
    };
    expect(await service.updateApp(args)).toEqual(EXAMPLE_APP);
    expect(prismaAppUpdateMock).toBeCalledTimes(1);
    expect(prismaAppUpdateMock).toBeCalledWith(args);
  });

  it('should commit', async () => {
    const args = {
      data: {
        message: EXAMPLE_MESSAGE,
        app: { connect: { id: EXAMPLE_APP_ID } },
        user: { connect: { id: EXAMPLE_USER_ID } }
      }
    };
    const findManyArgs = {
      where: {
        id: EXAMPLE_APP_ID,
        organization: {
          users: {
            some: {
              id: EXAMPLE_USER_ID
            }
          }
        }
      }
    };

    const createVersionArgs = {
      data: {
        commit: {
          connect: {
            id: EXAMPLE_COMMIT_ID
          }
        },
        entity: {
          connect: {
            id: EXAMPLE_ENTITY_ID
          }
        }
      }
    };
    const changedEntitiesArgs = {
      appId: EXAMPLE_APP_ID,
      userId: EXAMPLE_USER_ID
    };
    expect(await service.commit(args)).toEqual(EXAMPLE_COMMIT);
    expect(prismaAppFindManyMock).toBeCalledTimes(1);
    expect(prismaAppFindManyMock).toBeCalledWith(findManyArgs);

    expect(prismaCommitCreateMock).toBeCalledTimes(1);
    expect(prismaCommitCreateMock).toBeCalledWith(args);
    expect(entityServiceCreateVersionMock).toBeCalledTimes(1);
    expect(entityServiceCreateVersionMock).toBeCalledWith(createVersionArgs);
    expect(entityServiceReleaseLockMock).toBeCalledTimes(1);
    expect(entityServiceReleaseLockMock).toBeCalledWith(EXAMPLE_ENTITY_ID);

    expect(entityServiceGetChangedEntitiesMock).toBeCalledTimes(1);
    expect(entityServiceGetChangedEntitiesMock).toBeCalledWith(
      changedEntitiesArgs.appId,
      changedEntitiesArgs.userId
    );
  });
});
