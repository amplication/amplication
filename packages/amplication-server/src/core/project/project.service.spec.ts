import { PrismaService } from '@amplication/prisma-db';
import { Test, TestingModule } from '@nestjs/testing';
import { ProjectService } from './project.service';
import {
  Block,
  BlockVersion,
  Commit,
  Entity,
  EntityVersion,
  Resource
} from '../../models';
import { Environment } from '../environment/dto';
import { Build } from '../build/dto/Build';
import {
  EnumResourceType,
  EnumPendingChangeAction,
  EnumPendingChangeOriginType
} from '@amplication/code-gen-types/dist/models';
import { PendingChange } from '../resource/dto/PendingChange';
import { ResourceService } from '../resource/resource.service';
import { BuildService } from '../build/build.service';
import { EntityService } from '../entity/entity.service';
import { EnumBlockType } from '../../enums/EnumBlockType';
import { CURRENT_VERSION_NUMBER } from '../entity/constants';
import { BlockService } from '../block/block.service';

/** values mock */
const EXAMPLE_USER_ID = 'exampleUserId';
const EXAMPLE_MESSAGE = 'exampleMessage';
const EXAMPLE_PROJECT_ID = 'exampleProjectId';
const EXAMPLE_COMMIT_ID = 'exampleCommitId';
const EXAMPLE_RESOURCE_ID = 'exampleResourceId';
const EXAMPLE_ENTITY_ID = 'exampleEntityId';
const EXAMPLE_VERSION_NUMBER = 1;
const EXAMPLE_NAME = 'exampleName';
const EXAMPLE_DESCRIPTION = 'exampleDescription';
const EXAMPLE_DISPLAY_NAME = 'exampleDisplayName';
const EXAMPLE_PLURAL_DISPLAY_NAME = 'examplePluralDisplayName';
const EXAMPLE_BUILD_ID = 'exampleBuildId';
const EXAMPLE_VERSION = 'exampleVersion';
const EXAMPLE_ACTION_ID = 'exampleActionId';
const EXAMPLE_ENVIRONMENT_ID = 'exampleEnvironmentId';
const EXAMPLE_ADDRESS = 'exampleAddress';
const EXAMPLE_BLOCK_ID = 'exampleBlockId';
const EXAMPLE_BLOCK_DISPLAY_NAME = 'Example Entity Name';
const EXAMPLE_ENTITY_VERSION_ID = 'exampleEntityVersionId';
const EXAMPLE_ENTITY_NAME = 'ExampleEntityName';
const EXAMPLE_ENTITY_DISPLAY_NAME = 'Example Entity Name';
const EXAMPLE_ENTITY_PLURAL_DISPLAY_NAME = 'Example Entity Names';
const EXAMPLE_BLOCK_VERSION_ID = 'exampleBlockVersionId';

/** models mock */
const EXAMPLE_COMMIT: Commit = {
  id: EXAMPLE_COMMIT_ID,
  createdAt: new Date(),
  userId: EXAMPLE_USER_ID,
  message: EXAMPLE_MESSAGE
};

const EXAMPLE_ENVIRONMENT: Environment = {
  id: EXAMPLE_ENVIRONMENT_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  resourceId: EXAMPLE_RESOURCE_ID,
  name: EXAMPLE_NAME,
  address: EXAMPLE_ADDRESS
};

const EXAMPLE_BUILD: Build = {
  id: EXAMPLE_BUILD_ID,
  userId: EXAMPLE_USER_ID,
  resourceId: EXAMPLE_RESOURCE_ID,
  version: EXAMPLE_VERSION,
  actionId: EXAMPLE_ACTION_ID,
  createdAt: new Date(),
  commitId: EXAMPLE_COMMIT_ID
};

const EXAMPLE_ENTITY: Entity = {
  id: EXAMPLE_ENTITY_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  resourceId: EXAMPLE_RESOURCE_ID,
  name: EXAMPLE_NAME,
  displayName: EXAMPLE_DISPLAY_NAME,
  pluralDisplayName: EXAMPLE_PLURAL_DISPLAY_NAME
};

const EXAMPLE_BLOCK: Block = {
  id: EXAMPLE_BLOCK_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  resourceId: EXAMPLE_RESOURCE_ID,
  displayName: EXAMPLE_BLOCK_DISPLAY_NAME,
  blockType: EnumBlockType.ServiceSettings,
  parentBlock: null,
  versionNumber: CURRENT_VERSION_NUMBER,
  description: 'example block description'
};

const EXAMPLE_RESOURCE: Resource = {
  id: EXAMPLE_RESOURCE_ID,
  resourceType: EnumResourceType.Service,
  createdAt: new Date(),
  updatedAt: new Date(),
  name: EXAMPLE_NAME,
  description: EXAMPLE_DESCRIPTION,
  entities: [EXAMPLE_ENTITY],
  builds: [EXAMPLE_BUILD],
  environments: [EXAMPLE_ENVIRONMENT],
  gitRepositoryOverride: false
};

const EXAMPLE_CHANGED_ENTITY: PendingChange = {
  originId: EXAMPLE_ENTITY_ID,
  action: EnumPendingChangeAction.Create,
  originType: EnumPendingChangeOriginType.Entity,
  versionNumber: 1,
  origin: EXAMPLE_ENTITY,
  resource: EXAMPLE_RESOURCE
};

const EXAMPLE_CHANGED_BLOCK: PendingChange = {
  originId: EXAMPLE_BLOCK_ID,
  action: EnumPendingChangeAction.Create,
  originType: EnumPendingChangeOriginType.Block,
  versionNumber: 1,
  origin: EXAMPLE_BLOCK,
  resource: EXAMPLE_RESOURCE
};

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

const EXAMPLE_PROJECT_CONFIGURATION = {};

/** methods mock */
const prismaResourceCreateMock = jest.fn(() => {
  return EXAMPLE_RESOURCE;
});
const prismaResourceFindManyMock = jest.fn(() => {
  return [EXAMPLE_RESOURCE];
});
const prismaEntityFindManyMock = jest.fn(() => {
  return [EXAMPLE_ENTITY];
});
const prismaCommitCreateMock = jest.fn(() => {
  return EXAMPLE_COMMIT;
});
const buildServiceCreateMock = jest.fn(() => EXAMPLE_BUILD);
const entityServiceCreateVersionMock = jest.fn(
  async () => EXAMPLE_ENTITY_VERSION
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
const createProjectConfigurationMock = jest.fn(() => {
  return EXAMPLE_PROJECT_CONFIGURATION;
});
const blockServiceReleaseLockMock = jest.fn(async () => EXAMPLE_BLOCK);

describe('ProjectService', () => {
  let service: ProjectService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectService,
        {
          provide: PrismaService,
          useClass: jest.fn().mockImplementation(() => ({
            resource: {
              create: prismaResourceCreateMock,
              findMany: prismaResourceFindManyMock
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
          provide: BuildService,
          useClass: jest.fn(() => ({
            create: buildServiceCreateMock
          }))
        },
        {
          provide: EntityService,
          useClass: jest.fn().mockImplementation(() => ({
            createVersion: entityServiceCreateVersionMock,
            getChangedEntities: entityServiceGetChangedEntitiesMock,
            releaseLock: entityServiceReleaseLockMock
          }))
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
          provide: ResourceService,
          useClass: jest.fn(() => ({
            createProjectConfiguration: createProjectConfigurationMock
          }))
        }
      ]
    }).compile();

    service = module.get<ProjectService>(ProjectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should commit', async () => {
    const args = {
      data: {
        message: EXAMPLE_MESSAGE,
        project: { connect: { id: EXAMPLE_PROJECT_ID } },
        user: { connect: { id: EXAMPLE_USER_ID } }
      }
    };
    const findManyArgs = {
      where: {
        deletedAt: null,
        projectId: EXAMPLE_PROJECT_ID,
        project: {
          workspace: {
            users: {
              some: {
                id: EXAMPLE_USER_ID
              }
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
      projectId: EXAMPLE_PROJECT_ID,
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
      changesArgs.projectId,
      changesArgs.userId
    );
    expect(blockServiceGetChangedBlocksMock).toBeCalledTimes(1);
    expect(blockServiceGetChangedBlocksMock).toBeCalledWith(
      changesArgs.projectId,
      changesArgs.userId
    );
    expect(buildServiceCreateMock).toBeCalledTimes(1);
    expect(buildServiceCreateMock).toBeCalledWith(buildCreateArgs, false);
  });
});
