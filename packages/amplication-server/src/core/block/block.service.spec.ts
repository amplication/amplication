import { Test, TestingModule } from '@nestjs/testing';
import { JsonArray, JsonObject } from 'type-fest';
import { BlockService } from './block.service';
import {
  PrismaService,
  Prisma,
  EnumResourceType
} from '@amplication/prisma-db';
import { EnumBlockType } from 'src/enums/EnumBlockType';
import { DiffModule } from 'src/services/diff.module';
import {
  Resource,
  Block,
  BlockVersion,
  IBlock,
  BlockInputOutput,
  User
} from 'src/models';
import { DiffService } from 'src/services/diff.service';

const INITIAL_VERSION_NUMBER = 0;
const NOW = new Date();
const EXAMPLE_USER_ID = 'exampleUserId';
const EXAMPLE_WORKSPACE_ID = 'exampleWorkspaceId';
const EXAMPLE_COMMIT_ID = 'exampleCommitId';

const EXAMPLE_RESOURCE: Resource = {
  id: 'ExampleResource',
  resourceType: EnumResourceType.Service,
  createdAt: NOW,
  updatedAt: NOW,
  name: 'Example Resource',
  description: 'Example Resource Description',
  gitRepositoryOverride: false
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

const EXAMPLE_BLOCK: Block = {
  id: 'ExampleBlock',
  createdAt: NOW,
  updatedAt: NOW,
  resourceId: EXAMPLE_RESOURCE.id,
  resource: EXAMPLE_RESOURCE,
  blockType: EnumBlockType.ConnectorRestApi,
  displayName: 'Example Block',
  description: 'Block Description',
  parentBlockId: null,
  parentBlock: null
};

const EXAMPLE_BLOCK_SETTINGS: { exampleSetting: string } = {
  exampleSetting: 'Example Setting Value'
};

const EXAMPLE_BLOCK_INPUT: JsonObject & BlockInputOutput = {
  name: 'BlockInput'
};

const EXAMPLE_BLOCK_INPUT_LIST: JsonArray & BlockInputOutput[] = [
  EXAMPLE_BLOCK_INPUT
];

const EXAMPLE_BLOCK_VERSION: BlockVersion = {
  id: 'ExampleBlockVersion',
  createdAt: NOW,
  updatedAt: NOW,
  block: EXAMPLE_BLOCK,
  versionNumber: 0,
  settings: EXAMPLE_BLOCK_SETTINGS,
  displayName: 'Example display name',
  inputParameters: { params: EXAMPLE_BLOCK_INPUT_LIST },
  outputParameters: { params: EXAMPLE_BLOCK_INPUT_LIST }
};

type BlockType = IBlock & {
  exampleSetting: string;
};

const EXAMPLE_IBLOCK: BlockType = {
  id: EXAMPLE_BLOCK.id,
  createdAt: EXAMPLE_BLOCK.createdAt,
  updatedAt: EXAMPLE_BLOCK.updatedAt,
  blockType: EnumBlockType.ConnectorRestApi,
  displayName: EXAMPLE_BLOCK.displayName,
  description: EXAMPLE_BLOCK.description,
  inputParameters: EXAMPLE_BLOCK_INPUT_LIST,
  outputParameters: EXAMPLE_BLOCK_INPUT_LIST,
  parentBlock: EXAMPLE_BLOCK.parentBlock,
  versionNumber: EXAMPLE_BLOCK_VERSION.versionNumber,
  ...EXAMPLE_BLOCK_SETTINGS
};

const prismaBlockFindOneMock = jest.fn(() => {
  return EXAMPLE_BLOCK;
});
const prismaBlockFindFirstMock = jest.fn(() => {
  return EXAMPLE_BLOCK;
});
const prismaBlockUpdateMock = jest.fn(() => {
  return EXAMPLE_BLOCK;
});
const prismaBlockFindManyMock = jest.fn(() => {
  return [EXAMPLE_BLOCK];
});
const prismaBlockVersionCreateMock = jest.fn(() => {
  return EXAMPLE_BLOCK_VERSION;
});
const prismaBlockVersionFindManyMock = jest.fn(() => {
  return [EXAMPLE_BLOCK_VERSION];
});
const prismaBlockVersionFindOneMock = jest.fn(() => {
  return EXAMPLE_BLOCK_VERSION;
});
const prismaBlockVersionUpdateMock = jest.fn(() => {
  return EXAMPLE_BLOCK_VERSION;
});
const areDifferentMock = jest.fn(() => true);

describe('BlockService', () => {
  let service: BlockService;
  prismaBlockFindOneMock.mockClear();
  prismaBlockUpdateMock.mockClear();
  prismaBlockFindFirstMock.mockClear();
  prismaBlockFindManyMock.mockClear();
  prismaBlockVersionCreateMock.mockClear();
  prismaBlockVersionFindManyMock.mockClear();
  prismaBlockVersionFindOneMock.mockClear();
  prismaBlockVersionUpdateMock.mockClear();

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PrismaService,
          useClass: jest.fn(() => ({
            block: {
              findUnique: prismaBlockFindOneMock,
              findFirst: prismaBlockFindFirstMock,
              findMany: prismaBlockFindManyMock,
              update: prismaBlockUpdateMock
            },
            blockVersion: {
              create: prismaBlockVersionCreateMock,
              findMany: prismaBlockVersionFindManyMock,
              findUnique: prismaBlockVersionFindOneMock,
              update: prismaBlockVersionUpdateMock
            }
          }))
        },
        BlockService
      ],
      imports: [DiffModule]
    })
      .overrideProvider(DiffService)
      .useValue({ areDifferent: areDifferentMock })
      .compile();

    service = module.get<BlockService>(BlockService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates block correctly', async () => {
    const result = await service.create<BlockType>(
      {
        data: {
          resource: {
            connect: {
              id: EXAMPLE_BLOCK.resourceId
            }
          },
          blockType: EnumBlockType[EXAMPLE_BLOCK.blockType],
          displayName: EXAMPLE_BLOCK.displayName,
          description: EXAMPLE_BLOCK.description,
          inputParameters: EXAMPLE_BLOCK_INPUT_LIST,
          outputParameters: EXAMPLE_BLOCK_INPUT_LIST,
          ...EXAMPLE_BLOCK_SETTINGS
        }
      },
      EXAMPLE_USER.id
    );
    expect(result).toEqual(EXAMPLE_IBLOCK);
    expect(prismaBlockVersionCreateMock).toHaveBeenCalledTimes(1);
    expect(prismaBlockVersionCreateMock).toHaveBeenCalledWith({
      data: {
        versionNumber: EXAMPLE_BLOCK_VERSION.versionNumber,
        block: {
          create: {
            resource: {
              connect: {
                id: EXAMPLE_RESOURCE.id
              }
            },
            blockType: EXAMPLE_BLOCK.blockType,
            description: EXAMPLE_BLOCK.description,
            displayName: EXAMPLE_BLOCK.displayName,
            lockedAt: expect.any(Date),
            lockedByUser: {
              connect: {
                id: EXAMPLE_USER_ID
              }
            },

            parentBlock: undefined
          }
        },
        settings: EXAMPLE_BLOCK_VERSION.settings,
        commit: undefined,
        displayName: EXAMPLE_BLOCK.displayName,
        description: EXAMPLE_BLOCK.description,
        inputParameters: {
          params: EXAMPLE_BLOCK_INPUT_LIST
        },
        outputParameters: {
          params: EXAMPLE_BLOCK_INPUT_LIST
        }
      },
      include: {
        block: {
          include: {
            resource: true,
            parentBlock: true
          }
        }
      }
    });
  });

  it('finds a block correctly', async () => {
    const result = await service.findOne({
      where: {
        id: EXAMPLE_BLOCK.id
      }
    });
    expect(result).toEqual(EXAMPLE_IBLOCK);
    expect(prismaBlockVersionFindOneMock).toHaveBeenCalledTimes(1);
    expect(prismaBlockVersionFindOneMock).toHaveBeenCalledWith({
      where: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        blockId_versionNumber: {
          blockId: EXAMPLE_BLOCK.id,
          versionNumber: EXAMPLE_BLOCK_VERSION.versionNumber
        }
      },
      include: {
        block: {
          include: {
            parentBlock: true
          }
        }
      }
    });
  });

  it('creates a version', async () => {
    prismaBlockVersionFindManyMock.mockClear();
    prismaBlockVersionCreateMock.mockClear();
    const result = await service.createVersion({
      data: {
        commit: {
          connect: {
            id: EXAMPLE_COMMIT_ID
          }
        },
        block: {
          connect: {
            id: EXAMPLE_BLOCK.id
          }
        }
      }
    });
    expect(result).toEqual(EXAMPLE_BLOCK_VERSION);

    expect(prismaBlockVersionFindManyMock).toHaveBeenCalledTimes(1);
    expect(prismaBlockVersionFindManyMock).toHaveBeenCalledWith({
      where: {
        block: { id: EXAMPLE_BLOCK.id }
      },
      orderBy: {
        versionNumber: Prisma.SortOrder.asc
      }
    });

    expect(prismaBlockVersionCreateMock).toHaveBeenCalledTimes(1);
    expect(prismaBlockVersionCreateMock).toHaveBeenCalledWith({
      data: {
        displayName: EXAMPLE_BLOCK_VERSION.displayName,
        description: EXAMPLE_BLOCK_VERSION.description,
        inputParameters: EXAMPLE_BLOCK_VERSION.inputParameters,
        outputParameters: EXAMPLE_BLOCK_VERSION.outputParameters,
        settings: EXAMPLE_BLOCK_VERSION.settings,
        commit: {
          connect: {
            id: EXAMPLE_COMMIT_ID
          }
        },
        versionNumber: EXAMPLE_BLOCK_VERSION.versionNumber + 1,
        block: {
          connect: {
            id: EXAMPLE_BLOCK.id
          }
        }
      }
    });
  });

  it('updates block correctly', async () => {
    const result = await service.update<BlockType>(
      {
        where: {
          id: EXAMPLE_BLOCK.resourceId
        },
        data: {
          displayName: EXAMPLE_BLOCK.displayName,
          description: EXAMPLE_BLOCK.description,
          ...EXAMPLE_BLOCK_SETTINGS
        }
      },
      EXAMPLE_USER
    );
    expect(result).toEqual(EXAMPLE_IBLOCK);
    expect(prismaBlockVersionUpdateMock).toHaveBeenCalledTimes(1);
    expect(prismaBlockVersionUpdateMock).toHaveBeenCalledWith({
      data: {
        settings: EXAMPLE_BLOCK_SETTINGS,
        displayName: EXAMPLE_BLOCK.displayName,
        description: EXAMPLE_BLOCK.description,
        block: {
          update: {
            displayName: EXAMPLE_BLOCK.displayName,
            description: EXAMPLE_BLOCK.description
          }
        }
      },
      where: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        blockId_versionNumber: {
          blockId: EXAMPLE_BLOCK.resourceId,
          versionNumber: INITIAL_VERSION_NUMBER
        }
      },
      include: {
        block: {
          include: {
            parentBlock: true
          }
        }
      }
    });
  });

  it('should still call updateLock when an error occurs', async () => {
    jest.spyOn(service, 'updateLock');
    prismaBlockVersionUpdateMock.mockImplementation(() => {
      throw new Error();
    });

    const args = {
      where: {
        id: EXAMPLE_BLOCK.id
      },
      data: {
        displayName: EXAMPLE_BLOCK.displayName,
        description: EXAMPLE_BLOCK.description,
        ...EXAMPLE_BLOCK_SETTINGS
      }
    };
    await expect(service.update(args, EXAMPLE_USER)).rejects.toThrowError();
    expect(service.updateLock).toBeCalled();
  });

  it('should find many blocks', async () => {
    const args = {};
    expect(await service.findMany(args)).toEqual([EXAMPLE_BLOCK]);
    expect(prismaBlockFindManyMock).toBeCalledTimes(1);
    expect(prismaBlockFindManyMock).toBeCalledWith(args);
  });

  it('should find many blocks by block type', async () => {
    prismaBlockFindManyMock.mockImplementation(() => [
      { ...EXAMPLE_BLOCK, versions: [EXAMPLE_BLOCK_VERSION] }
    ]);
    const functionArgs = {
      args: {},
      blockType: EnumBlockType.ConnectorRestApi
    };
    const blocksArgs = {
      ...functionArgs.args,
      where: {
        blockType: { equals: functionArgs.blockType }
      },
      include: {
        versions: {
          where: {
            versionNumber: INITIAL_VERSION_NUMBER
          }
        },
        parentBlock: true
      }
    };
    expect(
      await service.findManyByBlockType(
        functionArgs.args,
        functionArgs.blockType
      )
    ).toEqual([EXAMPLE_IBLOCK]);
    expect(prismaBlockFindManyMock).toBeCalledTimes(1);
    expect(prismaBlockFindManyMock).toBeCalledWith(blocksArgs);
  });

  it('should get many versions', async () => {
    const args = {};

    expect(await service.getVersions(args)).toEqual([EXAMPLE_BLOCK_VERSION]);
    expect(prismaBlockVersionFindManyMock).toBeCalledTimes(1);
    expect(prismaBlockVersionFindManyMock).toBeCalledWith(args);
  });

  it('should get a parent block when one is provided', async () => {
    const block = {
      parentBlockId: EXAMPLE_BLOCK.parentBlockId,
      parentBlock: EXAMPLE_BLOCK.parentBlock
    };
    expect(await service.getParentBlock(block)).toEqual(null);
  });

  it('should return null when no parent block id is provided', async () => {
    const block = {};
    expect(await service.getParentBlock(block)).toEqual(null);
  });

  it('should find a parent block when only a parent block id is provided', async () => {
    const block = {
      parentBlockId: EXAMPLE_BLOCK.id
    };
    expect(await service.getParentBlock(block)).toEqual(EXAMPLE_BLOCK);
    expect(prismaBlockFindOneMock).toBeCalledTimes(1);
    expect(prismaBlockFindOneMock).toBeCalledWith({
      where: { id: block.parentBlockId }
    });
  });

  it('should have no pending changes when the current and last block versions are the same', async () => {
    const LAST_BLOCK_VERSION = {
      ...EXAMPLE_BLOCK_VERSION,
      versionNumber: 2
    };

    prismaBlockVersionFindManyMock.mockImplementation(() => [
      EXAMPLE_BLOCK_VERSION,
      { ...EXAMPLE_BLOCK_VERSION, versionNumber: 1 },
      LAST_BLOCK_VERSION
    ]);
    areDifferentMock.mockImplementationOnce(() => false);

    expect(await service.hasPendingChanges(EXAMPLE_BLOCK.id)).toBe(false);
    expect(areDifferentMock).toBeCalledWith(
      EXAMPLE_BLOCK_VERSION,
      LAST_BLOCK_VERSION,
      expect.anything()
    );
  });

  it('should have pending changes when the current and last block versions are different', async () => {
    const CURRENT_BLOCK_VERSION = {
      ...EXAMPLE_BLOCK_VERSION,
      displayName: 'new block name'
    };

    prismaBlockVersionFindManyMock.mockImplementationOnce(() => [
      CURRENT_BLOCK_VERSION,
      EXAMPLE_BLOCK_VERSION
    ]);
    areDifferentMock.mockImplementationOnce(() => true);

    expect(await service.hasPendingChanges(EXAMPLE_BLOCK.id)).toBe(true);
    expect(areDifferentMock).toBeCalledWith(
      CURRENT_BLOCK_VERSION,
      EXAMPLE_BLOCK_VERSION,
      expect.anything()
    );
  });

  it('should have pending changes when there is only one block version', async () => {
    prismaBlockVersionFindManyMock.mockImplementationOnce(() => [
      EXAMPLE_BLOCK_VERSION
    ]);
    areDifferentMock.mockImplementationOnce(() => true);

    expect(await service.hasPendingChanges(EXAMPLE_BLOCK.id)).toBe(true);
    expect(areDifferentMock).toBeCalledWith(
      EXAMPLE_BLOCK_VERSION,
      undefined,
      expect.anything()
    );
  });

  it('should have no pending changes when there is only one block version and it was deleted', async () => {
    prismaBlockVersionFindManyMock.mockImplementationOnce(() => [
      {
        ...EXAMPLE_BLOCK_VERSION,
        deleted: true
      }
    ]);
    areDifferentMock.mockImplementationOnce(() => true);

    expect(await service.hasPendingChanges(EXAMPLE_BLOCK.id)).toBe(false);
    expect(areDifferentMock).not.toBeCalled();
  });
});
