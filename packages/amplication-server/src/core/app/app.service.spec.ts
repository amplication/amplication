import { Test, TestingModule } from '@nestjs/testing';
import cuid from 'cuid';
import {
  AppService,
  INITIAL_COMMIT_MESSAGE,
  DEFAULT_APP_COLOR,
  DEFAULT_APP_DATA
} from './app.service';

import { PrismaService } from 'nestjs-prisma';
import { EntityService } from '../entity/entity.service';
import {
  EnvironmentService,
  DEFAULT_ENVIRONMENT_NAME
} from '../environment/environment.service';
import { Environment } from '../environment/dto/Environment';
import { App } from 'src/models/App';
import { User } from 'src/models/User';
import { Entity } from 'src/models/Entity';
import { EntityField } from 'src/models/EntityField';
import { PendingChange } from './dto/PendingChange';
import { EntityVersion, Commit } from 'src/models';
import { EnumPendingChangeAction, EnumPendingChangeResourceType } from './dto';
import {
  createSampleAppEntities,
  CREATE_SAMPLE_ENTITIES_COMMIT_MESSAGE,
  SAMPLE_APP_DATA
} from './sampleApp';
import { USER_ENTITY_NAME } from '../entity/constants';
import { InvalidColorError } from './InvalidColorError';
import { BuildService } from '../build/build.service';
import { Build } from '../build/dto/Build';
import { GithubService } from '../github/github.service';
import { EnumDataType } from 'src/enums/EnumDataType';
import { ReservedEntityNameError } from './ReservedEntityNameError';
import { QueryMode } from 'src/enums/QueryMode';

const EXAMPLE_MESSAGE = 'exampleMessage';
const EXAMPLE_APP_ID = 'exampleAppId';
const EXAMPLE_APP_NAME = 'exampleAppName';
const EXAMPLE_APP_DESCRIPTION = 'exampleAppName';
const INVALID_COLOR = 'INVALID_COLOR';

const EXAMPLE_CUID = 'EXAMPLE_CUID';

const EXAMPLE_BUILD_ID = 'ExampleBuildId';
const EXAMPLE_WORKSPACE_ID = 'ExampleWorkspaceId';

const EXAMPLE_APP: App = {
  ...DEFAULT_APP_DATA,
  id: EXAMPLE_APP_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  name: EXAMPLE_APP_NAME,
  description: EXAMPLE_APP_DESCRIPTION,
  githubSyncEnabled: false
};

const EXAMPLE_USER_ID = 'exampleUserId';
const EXAMPLE_USER_APP_ROLE = {
  name: 'user',
  displayName: 'User'
};

const EXAMPLE_USER: User = {
  id: EXAMPLE_USER_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  workspace: {
    id: EXAMPLE_WORKSPACE_ID,
    createdAt: new Date(),
    updatedAt: new Date(),
    name: 'example_workspace_name'
  }
};

const EXAMPLE_ENTITY_ID = 'exampleEntityId';
const EXAMPLE_ENTITY_NAME = 'ExampleEntityName';
const EXAMPLE_ENTITY_DISPLAY_NAME = 'Example Entity Name';
const EXAMPLE_ENTITY_PLURAL_DISPLAY_NAME = 'Example Entity Names';
const EXAMPLE_ENTITY_FIELD_NAME = 'exampleEntityFieldName';

const EXAMPLE_ENTITY: Entity = {
  id: EXAMPLE_ENTITY_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  appId: EXAMPLE_APP_ID,
  name: EXAMPLE_ENTITY_NAME,
  displayName: EXAMPLE_ENTITY_DISPLAY_NAME,
  pluralDisplayName: EXAMPLE_ENTITY_PLURAL_DISPLAY_NAME
};

const EXAMPLE_ENTITY_FIELD: EntityField = {
  id: EXAMPLE_ENTITY_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  name: EXAMPLE_ENTITY_FIELD_NAME,
  dataType: EnumDataType.SingleLineText,
  description: 'SampleEntityDescription',
  displayName: 'SampleEntityFieldDisplayName',
  permanentId: 'SampleFieldPermanentId',
  properties: {},
  required: false,
  searchable: false
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

const EXAMPLE_ENVIRONMENT: Environment = {
  id: 'ExampleEnvironmentId',
  createdAt: new Date(),
  updatedAt: new Date(),
  address: 'ExampleEnvironmentAddress',
  name: DEFAULT_ENVIRONMENT_NAME,
  appId: EXAMPLE_APP_ID,
  description: 'ExampleEnvironmentDescription'
};

const EXAMPLE_BUILD: Build = {
  id: EXAMPLE_BUILD_ID,
  createdAt: new Date(),
  userId: EXAMPLE_USER_ID,
  appId: EXAMPLE_APP_ID,
  version: '1.0.0',
  message: 'new build',
  actionId: 'ExampleActionId',
  images: [],
  commitId: EXAMPLE_COMMIT_ID
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
const entityServiceCreateVersionMock = jest.fn(
  async () => EXAMPLE_ENTITY_VERSION
);
const entityServiceCreateOneEntityMock = jest.fn(async () => EXAMPLE_ENTITY);
const entityServiceCreateFieldByDisplayNameMock = jest.fn(
  async () => EXAMPLE_ENTITY_FIELD
);
const entityServiceReleaseLockMock = jest.fn(async () => EXAMPLE_ENTITY);

const entityServiceGetChangedEntitiesMock = jest.fn(() => {
  return [EXAMPLE_CHANGED_ENTITY];
});

const USER_ENTITY_MOCK = {
  id: 'USER_ENTITY_MOCK_ID'
};

const entityServiceCreateDefaultEntitiesMock = jest.fn();
const entityServiceFindFirstMock = jest.fn(() => USER_ENTITY_MOCK);
const entityServiceBulkCreateEntities = jest.fn();
const entityServiceBulkCreateFields = jest.fn();

const buildServiceCreateMock = jest.fn(() => EXAMPLE_BUILD);

const environmentServiceCreateDefaultEnvironmentMock = jest.fn(() => {
  return EXAMPLE_ENVIRONMENT;
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
          provide: BuildService,
          useClass: jest.fn(() => ({
            create: buildServiceCreateMock
          }))
        },
        {
          provide: PrismaService,
          useClass: jest.fn().mockImplementation(() => ({
            app: {
              create: prismaAppCreateMock,
              findUnique: prismaAppFindOneMock,
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
            createFieldByDisplayName: entityServiceCreateFieldByDisplayNameMock,
            createOneEntity: entityServiceCreateOneEntityMock,
            releaseLock: entityServiceReleaseLockMock,
            createDefaultEntities: entityServiceCreateDefaultEntitiesMock,
            getChangedEntities: entityServiceGetChangedEntitiesMock,
            findFirst: entityServiceFindFirstMock,
            bulkCreateEntities: entityServiceBulkCreateEntities,
            bulkCreateFields: entityServiceBulkCreateFields
          }))
        },
        {
          provide: GithubService,
          useValue: {}
        },
        {
          provide: EnvironmentService,
          useClass: jest.fn().mockImplementation(() => ({
            createDefaultEnvironment: environmentServiceCreateDefaultEnvironmentMock
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
    const prismaAppCreateAppArgs = {
      data: {
        ...createAppArgs.args.data,
        workspace: {
          connect: {
            id: createAppArgs.user.workspace?.id
          }
        },
        roles: {
          create: EXAMPLE_USER_APP_ROLE
        }
      }
    };
    const commitArgs = {
      data: {
        message: INITIAL_COMMIT_MESSAGE,
        app: { connect: { id: EXAMPLE_APP_ID } },
        user: { connect: { id: EXAMPLE_USER_ID } }
      }
    };
    const findManyArgs = {
      where: {
        id: EXAMPLE_APP_ID,
        workspace: {
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
    expect(
      await service.createApp(createAppArgs.args, createAppArgs.user)
    ).toEqual(EXAMPLE_APP);
    expect(prismaAppCreateMock).toBeCalledTimes(1);
    expect(prismaAppCreateMock).toBeCalledWith(prismaAppCreateAppArgs);
    expect(entityServiceCreateDefaultEntitiesMock).toBeCalledTimes(1);
    expect(entityServiceCreateDefaultEntitiesMock).toBeCalledWith(
      EXAMPLE_APP_ID,
      EXAMPLE_USER
    );

    expect(environmentServiceCreateDefaultEnvironmentMock).toBeCalledTimes(1);
    expect(environmentServiceCreateDefaultEnvironmentMock).toBeCalledWith(
      EXAMPLE_APP_ID
    );
    expect(prismaAppFindManyMock).toBeCalledTimes(1);
    expect(prismaAppFindManyMock).toHaveBeenCalledWith(findManyArgs);
    expect(prismaCommitCreateMock).toBeCalledTimes(1);
    expect(prismaCommitCreateMock).toBeCalledWith(commitArgs);
    expect(prismaCommitCreateMock).toBeCalledTimes(1);
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

  it('should fail to create app for invalid color', async () => {
    const createAppArgs = {
      args: {
        data: {
          name: EXAMPLE_APP_NAME,
          description: EXAMPLE_APP_DESCRIPTION,
          color: INVALID_COLOR
        }
      },
      user: EXAMPLE_USER
    };
    await expect(
      service.createApp(createAppArgs.args, createAppArgs.user)
    ).rejects.toThrow(new InvalidColorError(INVALID_COLOR));
  });

  it('should create a sample app', async () => {
    const prismaAppCreateAppArgs = {
      data: {
        ...DEFAULT_APP_DATA,
        ...SAMPLE_APP_DATA,
        workspace: {
          connect: {
            id: EXAMPLE_USER.workspace?.id
          }
        },
        roles: {
          create: EXAMPLE_USER_APP_ROLE
        }
      }
    };
    const initialCommitArgs = {
      data: {
        message: INITIAL_COMMIT_MESSAGE,
        app: { connect: { id: EXAMPLE_APP_ID } },
        user: { connect: { id: EXAMPLE_USER_ID } }
      }
    };
    const createSampleEntitiesCommitArgs = {
      data: {
        message: CREATE_SAMPLE_ENTITIES_COMMIT_MESSAGE,
        app: { connect: { id: EXAMPLE_APP_ID } },
        user: { connect: { id: EXAMPLE_USER_ID } }
      }
    };
    const findManyArgs = {
      where: {
        id: EXAMPLE_APP_ID,
        workspace: {
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
    await expect(service.createSampleApp(EXAMPLE_USER)).resolves.toEqual(
      EXAMPLE_APP
    );
    expect(prismaAppCreateMock).toBeCalledTimes(1);
    expect(prismaAppCreateMock).toBeCalledWith(prismaAppCreateAppArgs);
    expect(entityServiceFindFirstMock).toBeCalledTimes(1);
    expect(entityServiceFindFirstMock).toBeCalledWith({
      where: { name: USER_ENTITY_NAME, appId: EXAMPLE_APP_ID },
      select: { id: true }
    });
    expect(entityServiceBulkCreateEntities).toBeCalledWith(
      EXAMPLE_APP_ID,
      EXAMPLE_USER,
      createSampleAppEntities(USER_ENTITY_MOCK.id).entities
    );
    expect(entityServiceBulkCreateFields).toBeCalledWith(
      EXAMPLE_USER,
      USER_ENTITY_MOCK.id,
      createSampleAppEntities(USER_ENTITY_MOCK.id).userEntityFields
    );
    expect(prismaAppFindManyMock).toBeCalledTimes(2);
    expect(prismaAppFindManyMock.mock.calls).toEqual([
      [findManyArgs],
      [findManyArgs]
    ]);

    expect(prismaCommitCreateMock).toBeCalledTimes(2);
    expect(prismaCommitCreateMock.mock.calls).toEqual([
      [initialCommitArgs],
      [createSampleEntitiesCommitArgs]
    ]);
    expect(entityServiceCreateVersionMock).toBeCalledTimes(2);
    expect(entityServiceCreateVersionMock.mock.calls).toEqual([
      [createVersionArgs],
      [createVersionArgs]
    ]);
    expect(entityServiceReleaseLockMock).toBeCalledTimes(2);
    expect(entityServiceReleaseLockMock.mock.calls).toEqual([
      [EXAMPLE_ENTITY_ID],
      [EXAMPLE_ENTITY_ID]
    ]);
    expect(entityServiceGetChangedEntitiesMock).toBeCalledTimes(2);
    expect(entityServiceGetChangedEntitiesMock.mock.calls).toEqual([
      [changedEntitiesArgs.appId, changedEntitiesArgs.userId],
      [changedEntitiesArgs.appId, changedEntitiesArgs.userId]
    ]);
  });

  it('should fail to create app with entities with a reserved name', async () => {
    await expect(
      service.createAppWithEntities(
        {
          app: SAMPLE_APP_DATA,
          commitMessage: 'commitMessage',
          entities: [
            {
              name: USER_ENTITY_NAME,
              fields: [
                {
                  name: EXAMPLE_ENTITY_FIELD_NAME
                }
              ]
            }
          ]
        },

        EXAMPLE_USER
      )
    ).rejects.toThrow(new ReservedEntityNameError(USER_ENTITY_NAME));
  });

  it('should create app with entities', async () => {
    const prismaAppCreateAppArgs = {
      data: {
        ...DEFAULT_APP_DATA,
        ...SAMPLE_APP_DATA,
        workspace: {
          connect: {
            id: EXAMPLE_USER.workspace?.id
          }
        },
        roles: {
          create: EXAMPLE_USER_APP_ROLE
        }
      }
    };
    const initialCommitArgs = {
      data: {
        message: INITIAL_COMMIT_MESSAGE,
        app: { connect: { id: EXAMPLE_APP_ID } },
        user: { connect: { id: EXAMPLE_USER_ID } }
      }
    };
    const commitMessage = 'CreateWithEntitiesCommitMessage';
    const createSampleEntitiesCommitArgs = {
      data: {
        message: commitMessage,
        app: { connect: { id: EXAMPLE_APP_ID } },
        user: { connect: { id: EXAMPLE_USER_ID } }
      }
    };
    const findManyArgs = {
      where: {
        id: EXAMPLE_APP_ID,
        workspace: {
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

    const createOneEntityArgs = {
      data: {
        app: {
          connect: {
            id: EXAMPLE_APP_ID
          }
        },
        displayName: EXAMPLE_ENTITY_DISPLAY_NAME,
        name: EXAMPLE_ENTITY_NAME,
        pluralDisplayName: EXAMPLE_ENTITY_PLURAL_DISPLAY_NAME
      }
    };

    const createFieldByDisplayNameArgs = {
      data: {
        entity: {
          connect: {
            id: EXAMPLE_ENTITY_ID
          }
        },
        displayName: EXAMPLE_ENTITY_FIELD_NAME
      }
    };

    const changedEntitiesArgs = {
      appId: EXAMPLE_APP_ID,
      userId: EXAMPLE_USER_ID
    };
    await expect(
      service.createAppWithEntities(
        {
          app: SAMPLE_APP_DATA,
          commitMessage: commitMessage,
          entities: [
            {
              name: EXAMPLE_ENTITY_DISPLAY_NAME,
              fields: [
                {
                  name: EXAMPLE_ENTITY_FIELD_NAME
                }
              ]
            }
          ]
        },

        EXAMPLE_USER
      )
    ).resolves.toEqual(EXAMPLE_APP);
    expect(prismaAppCreateMock).toBeCalledTimes(1);
    expect(prismaAppCreateMock).toBeCalledWith(prismaAppCreateAppArgs);

    expect(prismaAppFindManyMock).toBeCalledTimes(3);
    expect(prismaAppFindManyMock.mock.calls).toEqual([
      [
        {
          where: {
            name: {
              mode: QueryMode.Insensitive,
              startsWith: SAMPLE_APP_DATA.name
            },
            workspaceId: EXAMPLE_WORKSPACE_ID
          },
          select: {
            name: true
          }
        }
      ],
      [findManyArgs],
      [findManyArgs]
    ]);

    expect(entityServiceCreateOneEntityMock).toBeCalledTimes(1);
    expect(entityServiceCreateOneEntityMock).toBeCalledWith(
      createOneEntityArgs,
      EXAMPLE_USER
    );

    expect(entityServiceCreateFieldByDisplayNameMock).toBeCalledTimes(1);
    expect(entityServiceCreateFieldByDisplayNameMock).toBeCalledWith(
      createFieldByDisplayNameArgs,
      EXAMPLE_USER
    );

    expect(prismaCommitCreateMock).toBeCalledTimes(2);
    expect(prismaCommitCreateMock.mock.calls).toEqual([
      [initialCommitArgs],
      [createSampleEntitiesCommitArgs]
    ]);
    expect(entityServiceCreateVersionMock).toBeCalledTimes(2);
    expect(entityServiceCreateVersionMock.mock.calls).toEqual([
      [createVersionArgs],
      [createVersionArgs]
    ]);
    expect(entityServiceReleaseLockMock).toBeCalledTimes(2);
    expect(entityServiceReleaseLockMock.mock.calls).toEqual([
      [EXAMPLE_ENTITY_ID],
      [EXAMPLE_ENTITY_ID]
    ]);
    expect(entityServiceGetChangedEntitiesMock).toBeCalledTimes(2);
    expect(entityServiceGetChangedEntitiesMock.mock.calls).toEqual([
      [changedEntitiesArgs.appId, changedEntitiesArgs.userId],
      [changedEntitiesArgs.appId, changedEntitiesArgs.userId]
    ]);
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
        workspace: {
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
    const buildCreateArgs = {
      data: {
        app: {
          connect: {
            id: EXAMPLE_APP_ID
          }
        },
        commit: {
          connect: {
            id: EXAMPLE_COMMIT_ID
          }
        },
        createdBy: {
          connect: {
            id: EXAMPLE_USER_ID
          }
        },
        message: args.data.message
      }
    };
    expect(await service.commit(args, false)).toEqual(EXAMPLE_COMMIT);
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
    expect(buildServiceCreateMock).toBeCalledTimes(1);
    expect(buildServiceCreateMock).toBeCalledWith(buildCreateArgs, false);
  });
});
