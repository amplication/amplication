import { Test, TestingModule } from '@nestjs/testing';
import cuid from 'cuid';
import {
  ResourceService,
  INITIAL_COMMIT_MESSAGE,
  DEFAULT_RESOURCE_COLOR,
  DEFAULT_RESOURCE_DATA,
  INVALID_RESOURCE_ID
} from './resource.service';

import { PrismaService, GitRepository } from '@amplication/prisma-db';
import { EntityService } from '../entity/entity.service';
import {
  EnvironmentService,
  DEFAULT_ENVIRONMENT_NAME
} from '../environment/environment.service';
import { Environment } from '../environment/dto/Environment';
import { Resource } from 'src/models/Resource';
import { User } from 'src/models/User';
import { Entity } from 'src/models/Entity';
import { Block } from 'src/models/Block';
import { EntityField } from 'src/models/EntityField';
import { PendingChange } from './dto/PendingChange';
import { EntityVersion, Commit, BlockVersion } from 'src/models';
import { EnumPendingChangeAction, EnumPendingChangeResourceType } from './dto';
import {
  createSampleResourceEntities,
  CREATE_SAMPLE_ENTITIES_COMMIT_MESSAGE,
  SAMPLE_RESOURCE_DATA
} from './sampleResource';
import { CURRENT_VERSION_NUMBER, USER_ENTITY_NAME } from '../entity/constants';
import { InvalidColorError } from './InvalidColorError';
import { BuildService } from '../build/build.service';
import { Build } from '../build/dto/Build';
import { BlockService } from '../block/block.service';
import { EnumDataType } from 'src/enums/EnumDataType';
import { ReservedEntityNameError } from './ReservedEntityNameError';
import { QueryMode } from 'src/enums/QueryMode';
import { prepareDeletedItemName } from '../../util/softDelete';
import { EnumBlockType } from 'src/enums/EnumBlockType';
import { GitService } from '@amplication/git-service';

const EXAMPLE_MESSAGE = 'exampleMessage';
const EXAMPLE_RESOURCE_ID = 'exampleResourceId';
const EXAMPLE_RESOURCE_NAME = 'exampleResourceName';
const EXAMPLE_RESOURCE_DESCRIPTION = 'exampleResourceName';
const INVALID_COLOR = 'INVALID_COLOR';

const EXAMPLE_CUID = 'EXAMPLE_CUID';

const EXAMPLE_BUILD_ID = 'ExampleBuildId';
const EXAMPLE_WORKSPACE_ID = 'ExampleWorkspaceId';

const EXAMPLE_RESOURCE: Resource = {
  ...DEFAULT_RESOURCE_DATA,
  id: EXAMPLE_RESOURCE_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  name: EXAMPLE_RESOURCE_NAME,
  description: EXAMPLE_RESOURCE_DESCRIPTION,
  deletedAt: null
};

const EXAMPLE_USER_ID = 'exampleUserId';
const EXAMPLE_USER_RESOURCE_ROLE = {
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
  },
  isOwner: true
};

const EXAMPLE_ENTITY_ID = 'exampleEntityId';
const EXAMPLE_ENTITY_NAME = 'ExampleEntityName';
const EXAMPLE_ENTITY_DISPLAY_NAME = 'Example Entity Name';
const EXAMPLE_ENTITY_PLURAL_DISPLAY_NAME = 'Example Entity Names';
const EXAMPLE_ENTITY_FIELD_NAME = 'exampleEntityFieldName';

const EXAMPLE_BLOCK_ID = 'exampleBlockId';
const EXAMPLE_BLOCK_DISPLAY_NAME = 'Example Entity Name';

const EXAMPLE_ENTITY: Entity = {
  id: EXAMPLE_ENTITY_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  resourceId: EXAMPLE_RESOURCE_ID,
  name: EXAMPLE_ENTITY_NAME,
  displayName: EXAMPLE_ENTITY_DISPLAY_NAME,
  pluralDisplayName: EXAMPLE_ENTITY_PLURAL_DISPLAY_NAME
};

const EXAMPLE_BLOCK: Block = {
  id: EXAMPLE_BLOCK_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  resourceId: EXAMPLE_RESOURCE_ID,
  displayName: EXAMPLE_BLOCK_DISPLAY_NAME,
  blockType: EnumBlockType.AppSettings,
  parentBlock: null,
  versionNumber: CURRENT_VERSION_NUMBER,
  description: 'example block description'
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
  unique: false,
  searchable: false
};

const EXAMPLE_CHANGED_ENTITY: PendingChange = {
  resourceId: EXAMPLE_ENTITY_ID,
  action: EnumPendingChangeAction.Create,
  resourceType: EnumPendingChangeResourceType.Entity,
  versionNumber: 1,
  resource: EXAMPLE_ENTITY
};

const EXAMPLE_CHANGED_BLOCK: PendingChange = {
  resourceId: EXAMPLE_BLOCK_ID,
  action: EnumPendingChangeAction.Create,
  resourceType: EnumPendingChangeResourceType.Block,
  versionNumber: 1,
  resource: EXAMPLE_BLOCK
};

const EXAMPLE_ENTITY_VERSION_ID = 'exampleEntityVersionId';
const EXAMPLE_BLOCK_VERSION_ID = 'exampleBlockVersionId';
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

const EXAMPLE_BLOCK_VERSION: BlockVersion = {
  id: EXAMPLE_BLOCK_VERSION_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  versionNumber: EXAMPLE_VERSION_NUMBER,
  displayName: EXAMPLE_BLOCK_DISPLAY_NAME
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
  resourceId: EXAMPLE_RESOURCE_ID,
  description: 'ExampleEnvironmentDescription'
};

const EXAMPLE_BUILD: Build = {
  id: EXAMPLE_BUILD_ID,
  createdAt: new Date(),
  userId: EXAMPLE_USER_ID,
  resourceId: EXAMPLE_RESOURCE_ID,
  version: '1.0.0',
  message: 'new build',
  actionId: 'ExampleActionId',
  images: [],
  commitId: EXAMPLE_COMMIT_ID
};

const EXAMPLE_GIT_REPOSITORY: GitRepository = {
  id: 'exampleGitRepositoryId',
  name: 'repositoryTest',
  resourceId: 'exampleResourceId',
  gitOrganizationId: 'exampleGitOrganizationId',
  createdAt: new Date(),
  updatedAt: new Date()
};

const prismaResourceCreateMock = jest.fn(() => {
  return EXAMPLE_RESOURCE;
});
const prismaResourceFindOneMock = jest.fn(() => {
  return EXAMPLE_RESOURCE;
});
const prismaResourceFindManyMock = jest.fn(() => {
  return [EXAMPLE_RESOURCE];
});
const prismaResourceDeleteMock = jest.fn(() => {
  return EXAMPLE_RESOURCE;
});
const prismaResourceUpdateMock = jest.fn(() => {
  return EXAMPLE_RESOURCE;
});
const prismaEntityFindManyMock = jest.fn(() => {
  return [EXAMPLE_ENTITY];
});
const prismaCommitCreateMock = jest.fn(() => {
  return EXAMPLE_COMMIT;
});

const prismaGitRepositoryCreateMock = jest.fn(() => {
  return EXAMPLE_GIT_REPOSITORY;
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

const blockServiceGetChangedBlocksMock = jest.fn(() => {
  return [EXAMPLE_CHANGED_BLOCK];
});
const blockServiceCreateVersionMock = jest.fn(
  async () => EXAMPLE_BLOCK_VERSION
);

const blockServiceReleaseLockMock = jest.fn(async () => EXAMPLE_BLOCK);

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

describe('ResourceService', () => {
  let service: ResourceService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResourceService,
        {
          provide: BuildService,
          useClass: jest.fn(() => ({
            create: buildServiceCreateMock
          }))
        },
        {
          provide: PrismaService,
          useClass: jest.fn().mockImplementation(() => ({
            resource: {
              create: prismaResourceCreateMock,
              findFirst: prismaResourceFindOneMock,
              findUnique: prismaResourceFindOneMock,
              findMany: prismaResourceFindManyMock,
              delete: prismaResourceDeleteMock,
              update: prismaResourceUpdateMock
            },
            entity: {
              findMany: prismaEntityFindManyMock
            },
            commit: {
              create: prismaCommitCreateMock
            },
            gitRepository: {
              findUnique: prismaGitRepositoryCreateMock,
              delete: prismaGitRepositoryCreateMock
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
          provide: GitService,
          useValue: {}
        },
        {
          provide: BlockService,
          useValue: {
            getChangedBlocks: blockServiceGetChangedBlocksMock,
            createVersion: blockServiceCreateVersionMock,
            releaseLock: blockServiceReleaseLockMock
          }
        },
        {
          provide: EnvironmentService,
          useClass: jest.fn().mockImplementation(() => ({
            createDefaultEnvironment: environmentServiceCreateDefaultEnvironmentMock
          }))
        }
      ]
    }).compile();

    service = module.get<ResourceService>(ResourceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an resource', async () => {
    const createResourceArgs = {
      args: {
        data: {
          name: EXAMPLE_RESOURCE_NAME,
          description: EXAMPLE_RESOURCE_DESCRIPTION,
          color: DEFAULT_RESOURCE_COLOR
        }
      },
      user: EXAMPLE_USER
    };
    const prismaResourceCreateResourceArgs = {
      data: {
        ...createResourceArgs.args.data,
        workspace: {
          connect: {
            id: createResourceArgs.user.workspace?.id
          }
        },
        roles: {
          create: EXAMPLE_USER_RESOURCE_ROLE
        },
        project: {
          create: {
            name: `project-${cuid()}`,
            workspaceId: EXAMPLE_USER.workspace?.id
          }
        }
      }
    };
    const commitArgs = {
      data: {
        message: INITIAL_COMMIT_MESSAGE,
        resource: { connect: { id: EXAMPLE_RESOURCE_ID } },
        user: { connect: { id: EXAMPLE_USER_ID } }
      }
    };
    const findManyArgs = {
      where: {
        deletedAt: null,
        id: EXAMPLE_RESOURCE_ID,
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
    const blockCreateVersionArgs = {
      data: {
        commit: {
          connect: {
            id: EXAMPLE_COMMIT_ID
          }
        },
        block: {
          connect: {
            id: EXAMPLE_BLOCK_ID
          }
        }
      }
    };
    const changedEntitiesArgs = {
      resourceId: EXAMPLE_RESOURCE_ID,
      userId: EXAMPLE_USER_ID
    };
    expect(
      await service.createResource(
        createResourceArgs.args,
        createResourceArgs.user
      )
    ).toEqual(EXAMPLE_RESOURCE);
    expect(prismaResourceCreateMock).toBeCalledTimes(1);
    expect(prismaResourceCreateMock).toBeCalledWith(
      prismaResourceCreateResourceArgs
    );
    expect(entityServiceCreateDefaultEntitiesMock).toBeCalledTimes(1);
    expect(entityServiceCreateDefaultEntitiesMock).toBeCalledWith(
      EXAMPLE_RESOURCE_ID,
      EXAMPLE_USER
    );

    expect(environmentServiceCreateDefaultEnvironmentMock).toBeCalledTimes(1);
    expect(environmentServiceCreateDefaultEnvironmentMock).toBeCalledWith(
      EXAMPLE_RESOURCE_ID
    );
    expect(prismaResourceFindManyMock).toBeCalledTimes(1);
    expect(prismaResourceFindManyMock).toHaveBeenCalledWith(findManyArgs);
    expect(prismaCommitCreateMock).toBeCalledTimes(1);
    expect(prismaCommitCreateMock).toBeCalledWith(commitArgs);
    expect(prismaCommitCreateMock).toBeCalledTimes(1);
    expect(entityServiceCreateVersionMock).toBeCalledTimes(1);
    expect(entityServiceCreateVersionMock).toBeCalledWith(createVersionArgs);
    expect(blockServiceCreateVersionMock).toBeCalledTimes(1);
    expect(blockServiceCreateVersionMock).toBeCalledWith(
      blockCreateVersionArgs
    );

    expect(entityServiceReleaseLockMock).toBeCalledTimes(1);
    expect(entityServiceReleaseLockMock).toBeCalledWith(EXAMPLE_ENTITY_ID);
    expect(blockServiceReleaseLockMock).toBeCalledTimes(1);
    expect(blockServiceReleaseLockMock).toBeCalledWith(EXAMPLE_BLOCK_ID);
    expect(entityServiceGetChangedEntitiesMock).toBeCalledTimes(1);
    expect(entityServiceGetChangedEntitiesMock).toBeCalledWith(
      changedEntitiesArgs.resourceId,
      changedEntitiesArgs.userId
    );
    expect(blockServiceGetChangedBlocksMock).toBeCalledTimes(1);
    expect(blockServiceGetChangedBlocksMock).toBeCalledWith(
      changedEntitiesArgs.resourceId,
      changedEntitiesArgs.userId
    );
  });

  it('should fail to create resource for invalid color', async () => {
    const createResourceArgs = {
      args: {
        data: {
          name: EXAMPLE_RESOURCE_NAME,
          description: EXAMPLE_RESOURCE_DESCRIPTION,
          color: INVALID_COLOR
        }
      },
      user: EXAMPLE_USER
    };
    await expect(
      service.createResource(createResourceArgs.args, createResourceArgs.user)
    ).rejects.toThrow(new InvalidColorError(INVALID_COLOR));
  });

  it('should create a sample resource', async () => {
    const prismaResourceCreateResourceArgs = {
      data: {
        ...DEFAULT_RESOURCE_DATA,
        ...SAMPLE_RESOURCE_DATA,
        workspace: {
          connect: {
            id: EXAMPLE_USER.workspace?.id
          }
        },
        roles: {
          create: EXAMPLE_USER_RESOURCE_ROLE
        },
        project: {
          create: {
            name: `project-${cuid()}`,
            workspaceId: EXAMPLE_USER.workspace?.id
          }
        }
      }
    };
    const initialCommitArgs = {
      data: {
        message: INITIAL_COMMIT_MESSAGE,
        resource: { connect: { id: EXAMPLE_RESOURCE_ID } },
        user: { connect: { id: EXAMPLE_USER_ID } }
      }
    };
    const createSampleEntitiesCommitArgs = {
      data: {
        message: CREATE_SAMPLE_ENTITIES_COMMIT_MESSAGE,
        resource: { connect: { id: EXAMPLE_RESOURCE_ID } },
        user: { connect: { id: EXAMPLE_USER_ID } }
      }
    };
    const findManyArgs = {
      where: {
        deletedAt: null,
        id: EXAMPLE_RESOURCE_ID,
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
    const blockCreateVersionArgs = {
      data: {
        commit: {
          connect: {
            id: EXAMPLE_COMMIT_ID
          }
        },
        block: {
          connect: {
            id: EXAMPLE_BLOCK_ID
          }
        }
      }
    };
    const changesArgs = {
      resourceId: EXAMPLE_RESOURCE_ID,
      userId: EXAMPLE_USER_ID
    };
    await expect(service.createSampleResource(EXAMPLE_USER)).resolves.toEqual(
      EXAMPLE_RESOURCE
    );
    expect(prismaResourceCreateMock).toBeCalledTimes(1);
    expect(prismaResourceCreateMock).toBeCalledWith(
      prismaResourceCreateResourceArgs
    );
    expect(entityServiceFindFirstMock).toBeCalledTimes(1);
    expect(entityServiceFindFirstMock).toBeCalledWith({
      where: { name: USER_ENTITY_NAME, resourceId: EXAMPLE_RESOURCE_ID },
      select: { id: true }
    });
    expect(entityServiceBulkCreateEntities).toBeCalledWith(
      EXAMPLE_RESOURCE_ID,
      EXAMPLE_USER,
      createSampleResourceEntities(USER_ENTITY_MOCK.id).entities
    );
    expect(entityServiceBulkCreateFields).toBeCalledWith(
      EXAMPLE_USER,
      USER_ENTITY_MOCK.id,
      createSampleResourceEntities(USER_ENTITY_MOCK.id).userEntityFields
    );
    expect(prismaResourceFindManyMock).toBeCalledTimes(2);
    expect(prismaResourceFindManyMock.mock.calls).toEqual([
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
    expect(blockServiceCreateVersionMock).toBeCalledTimes(2);
    expect(blockServiceCreateVersionMock.mock.calls).toEqual([
      [blockCreateVersionArgs],
      [blockCreateVersionArgs]
    ]);
    expect(entityServiceReleaseLockMock).toBeCalledTimes(2);
    expect(entityServiceReleaseLockMock.mock.calls).toEqual([
      [EXAMPLE_ENTITY_ID],
      [EXAMPLE_ENTITY_ID]
    ]);
    expect(blockServiceReleaseLockMock).toBeCalledTimes(2);
    expect(blockServiceReleaseLockMock.mock.calls).toEqual([
      [EXAMPLE_BLOCK_ID],
      [EXAMPLE_BLOCK_ID]
    ]);
    expect(entityServiceGetChangedEntitiesMock).toBeCalledTimes(2);
    expect(entityServiceGetChangedEntitiesMock.mock.calls).toEqual([
      [changesArgs.resourceId, changesArgs.userId],
      [changesArgs.resourceId, changesArgs.userId]
    ]);
    expect(blockServiceGetChangedBlocksMock).toBeCalledTimes(2);
    expect(blockServiceGetChangedBlocksMock.mock.calls).toEqual([
      [changesArgs.resourceId, changesArgs.userId],
      [changesArgs.resourceId, changesArgs.userId]
    ]);
  });

  it('should fail to create resource with entities with a reserved name', async () => {
    await expect(
      service.createResourceWithEntities(
        {
          resource: SAMPLE_RESOURCE_DATA,
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

  it('should create resource with entities', async () => {
    const prismaResourceCreateResourceArgs = {
      data: {
        ...DEFAULT_RESOURCE_DATA,
        ...SAMPLE_RESOURCE_DATA,
        workspace: {
          connect: {
            id: EXAMPLE_USER.workspace?.id
          }
        },
        roles: {
          create: EXAMPLE_USER_RESOURCE_ROLE
        },
        project: {
          create: {
            name: `project-${cuid()}`,
            workspaceId: EXAMPLE_USER.workspace?.id
          }
        }
      }
    };
    const initialCommitArgs = {
      data: {
        message: INITIAL_COMMIT_MESSAGE,
        resource: { connect: { id: EXAMPLE_RESOURCE_ID } },
        user: { connect: { id: EXAMPLE_USER_ID } }
      }
    };
    const commitMessage = 'CreateWithEntitiesCommitMessage';
    const createSampleEntitiesCommitArgs = {
      data: {
        message: commitMessage,
        resource: { connect: { id: EXAMPLE_RESOURCE_ID } },
        user: { connect: { id: EXAMPLE_USER_ID } }
      }
    };
    const findManyArgs = {
      where: {
        deletedAt: null,
        id: EXAMPLE_RESOURCE_ID,
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
    const blockCreateVersionArgs = {
      data: {
        commit: {
          connect: {
            id: EXAMPLE_COMMIT_ID
          }
        },
        block: {
          connect: {
            id: EXAMPLE_BLOCK_ID
          }
        }
      }
    };

    const createOneEntityArgs = {
      data: {
        resource: {
          connect: {
            id: EXAMPLE_RESOURCE_ID
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

    const changesArgs = {
      resourceId: EXAMPLE_RESOURCE_ID,
      userId: EXAMPLE_USER_ID
    };
    await expect(
      service.createResourceWithEntities(
        {
          resource: SAMPLE_RESOURCE_DATA,
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
    ).resolves.toEqual(EXAMPLE_RESOURCE);
    expect(prismaResourceCreateMock).toBeCalledTimes(1);
    expect(prismaResourceCreateMock).toBeCalledWith(
      prismaResourceCreateResourceArgs
    );

    expect(prismaResourceFindManyMock).toBeCalledTimes(3);
    expect(prismaResourceFindManyMock.mock.calls).toEqual([
      [
        {
          where: {
            deletedAt: null,
            name: {
              mode: QueryMode.Insensitive,
              startsWith: SAMPLE_RESOURCE_DATA.name
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
    expect(blockServiceCreateVersionMock).toBeCalledTimes(2);
    expect(blockServiceCreateVersionMock.mock.calls).toEqual([
      [blockCreateVersionArgs],
      [blockCreateVersionArgs]
    ]);
    expect(entityServiceReleaseLockMock).toBeCalledTimes(2);
    expect(entityServiceReleaseLockMock.mock.calls).toEqual([
      [EXAMPLE_ENTITY_ID],
      [EXAMPLE_ENTITY_ID]
    ]);
    expect(blockServiceReleaseLockMock).toBeCalledTimes(2);
    expect(blockServiceReleaseLockMock.mock.calls).toEqual([
      [EXAMPLE_BLOCK_ID],
      [EXAMPLE_BLOCK_ID]
    ]);
    expect(entityServiceGetChangedEntitiesMock).toBeCalledTimes(2);
    expect(entityServiceGetChangedEntitiesMock.mock.calls).toEqual([
      [changesArgs.resourceId, changesArgs.userId],
      [changesArgs.resourceId, changesArgs.userId]
    ]);
    expect(blockServiceGetChangedBlocksMock).toBeCalledTimes(2);
    expect(blockServiceGetChangedBlocksMock.mock.calls).toEqual([
      [changesArgs.resourceId, changesArgs.userId],
      [changesArgs.resourceId, changesArgs.userId]
    ]);
  });

  it('should find an resource', async () => {
    const args = {
      where: {
        deletedAt: null,
        id: EXAMPLE_RESOURCE_ID
      }
    };
    expect(await service.resource(args)).toEqual(EXAMPLE_RESOURCE);
    expect(prismaResourceFindOneMock).toBeCalledTimes(1);
    expect(prismaResourceFindOneMock).toBeCalledWith(args);
  });

  it('should find many resources', async () => {
    const args = {
      where: {
        deletedAt: null,
        id: EXAMPLE_RESOURCE_ID
      }
    };
    expect(await service.resources(args)).toEqual([EXAMPLE_RESOURCE]);
    expect(prismaResourceFindManyMock).toBeCalledTimes(1);
    expect(prismaResourceFindManyMock).toBeCalledWith(args);
  });

  it('should delete an resource', async () => {
    const args = { where: { id: EXAMPLE_RESOURCE_ID } };
    const dateSpy = jest.spyOn(global, 'Date');
    expect(await service.deleteResource(args)).toEqual(EXAMPLE_RESOURCE);
    expect(prismaResourceUpdateMock).toBeCalledTimes(1);
    expect(prismaResourceUpdateMock).toBeCalledWith({
      ...args,
      data: {
        deletedAt: dateSpy.mock.instances[0],
        name: prepareDeletedItemName(EXAMPLE_RESOURCE.name, EXAMPLE_RESOURCE.id)
      }
    });
  });

  it('should update an resource', async () => {
    const args = {
      data: { name: EXAMPLE_RESOURCE_NAME },
      where: { id: EXAMPLE_RESOURCE_ID }
    };
    expect(await service.updateResource(args)).toEqual(EXAMPLE_RESOURCE);
    expect(prismaResourceUpdateMock).toBeCalledTimes(1);
    expect(prismaResourceUpdateMock).toBeCalledWith(args);
  });

  it('should commit', async () => {
    const args = {
      data: {
        message: EXAMPLE_MESSAGE,
        resource: { connect: { id: EXAMPLE_RESOURCE_ID } },
        user: { connect: { id: EXAMPLE_USER_ID } }
      }
    };
    const findManyArgs = {
      where: {
        deletedAt: null,
        id: EXAMPLE_RESOURCE_ID,
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
    const blockCreateVersionArgs = {
      data: {
        commit: {
          connect: {
            id: EXAMPLE_COMMIT_ID
          }
        },
        block: {
          connect: {
            id: EXAMPLE_BLOCK_ID
          }
        }
      }
    };
    const changesArgs = {
      resourceId: EXAMPLE_RESOURCE_ID,
      userId: EXAMPLE_USER_ID
    };
    const buildCreateArgs = {
      data: {
        resource: {
          connect: {
            id: EXAMPLE_RESOURCE_ID
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
    expect(prismaResourceFindManyMock).toBeCalledTimes(1);
    expect(prismaResourceFindManyMock).toBeCalledWith(findManyArgs);

    expect(prismaCommitCreateMock).toBeCalledTimes(1);
    expect(prismaCommitCreateMock).toBeCalledWith(args);
    expect(entityServiceCreateVersionMock).toBeCalledTimes(1);
    expect(entityServiceCreateVersionMock).toBeCalledWith(createVersionArgs);
    expect(blockServiceCreateVersionMock).toBeCalledTimes(1);
    expect(blockServiceCreateVersionMock).toBeCalledWith(
      blockCreateVersionArgs
    );
    expect(entityServiceReleaseLockMock).toBeCalledTimes(1);
    expect(entityServiceReleaseLockMock).toBeCalledWith(EXAMPLE_ENTITY_ID);

    expect(blockServiceReleaseLockMock).toBeCalledTimes(1);
    expect(blockServiceReleaseLockMock).toBeCalledWith(EXAMPLE_BLOCK_ID);

    expect(entityServiceGetChangedEntitiesMock).toBeCalledTimes(1);
    expect(entityServiceGetChangedEntitiesMock).toBeCalledWith(
      changesArgs.resourceId,
      changesArgs.userId
    );
    expect(blockServiceGetChangedBlocksMock).toBeCalledTimes(1);
    expect(blockServiceGetChangedBlocksMock).toBeCalledWith(
      changesArgs.resourceId,
      changesArgs.userId
    );
    expect(buildServiceCreateMock).toBeCalledTimes(1);
    expect(buildServiceCreateMock).toBeCalledWith(buildCreateArgs, false);
  });

  describe('deleted resources', () => {
    beforeEach(() => {
      EXAMPLE_RESOURCE.deletedAt = new Date();
      prismaResourceFindOneMock.mockImplementationOnce(() => {
        throw new Error(INVALID_RESOURCE_ID);
      });
    });
    afterEach(() => {
      EXAMPLE_RESOURCE.deletedAt = null;
    });

    it('should fail to fetch a deleted resource', async () => {
      const args = { where: { id: EXAMPLE_RESOURCE_ID } };
      await expect(service.resource(args)).rejects.toThrow(
        new Error(INVALID_RESOURCE_ID)
      );
    });

    it('should fail to update a deleted resource', async () => {
      const args = {
        data: { name: EXAMPLE_RESOURCE_NAME },
        where: { id: EXAMPLE_RESOURCE_ID }
      };
      await expect(service.updateResource(args)).rejects.toThrow(
        new Error(INVALID_RESOURCE_ID)
      );
    });
  });
});
