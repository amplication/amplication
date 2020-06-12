import { Test, TestingModule } from '@nestjs/testing';
import { JsonArray, JsonObject } from 'type-fest';
import { BlockService } from './block.service';
import { PrismaService } from 'src/services/prisma.service';
import { EnumBlockType } from 'src/enums/EnumBlockType';
import { App, Block, BlockVersion, IBlock, BlockInputOutput } from 'src/models';

const NEW_VERSION_LABEL = 'Current Version';
const NOW = new Date();

const EXAMPLE_APP: App = {
  id: 'ExampleApp',
  createdAt: NOW,
  updatedAt: NOW,
  name: 'Example App',
  description: 'Example App Description'
};

const EXAMPLE_BLOCK: Block = {
  id: 'ExampleBlock',
  createdAt: NOW,
  updatedAt: NOW,
  appId: EXAMPLE_APP.id,
  app: EXAMPLE_APP,
  blockType: EnumBlockType.ConnectorRestApi,
  name: 'Example Block',
  description: 'Block Description',
  parentBlockId: null,
  parentBlock: null
};

const EXAMPLE_BLOCK_SETTINGS: JsonObject = {
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
  label: 'Block Version Label',
  inputParameters: { params: EXAMPLE_BLOCK_INPUT_LIST },
  outputParameters: { params: EXAMPLE_BLOCK_INPUT_LIST },
  settings: EXAMPLE_BLOCK_SETTINGS
};

const EXAMPLE_IBLOCK: IBlock = {
  id: EXAMPLE_BLOCK.id,
  createdAt: EXAMPLE_BLOCK.createdAt,
  updatedAt: EXAMPLE_BLOCK.updatedAt,
  blockType: EnumBlockType.ConnectorRestApi,
  name: EXAMPLE_BLOCK.name,
  description: EXAMPLE_BLOCK.description,
  inputParameters: EXAMPLE_BLOCK_INPUT_LIST,
  outputParameters: EXAMPLE_BLOCK_INPUT_LIST,
  parentBlock: EXAMPLE_BLOCK.parentBlock,
  versionNumber: EXAMPLE_BLOCK_VERSION.versionNumber,
  ...EXAMPLE_BLOCK_SETTINGS
};

const prismaBlockFindOneMock = jest.fn().mockImplementation(() => {
  return EXAMPLE_BLOCK;
});
const prismaBlockFindManyMock = jest.fn().mockImplementation(() => {
  return [EXAMPLE_BLOCK];
});
const prismaBlockVersionCreateMock = jest.fn().mockImplementation(() => {
  return EXAMPLE_BLOCK_VERSION;
});
const prismaBlockVersionFindManyMock = jest.fn().mockImplementation(() => {
  return [EXAMPLE_BLOCK_VERSION];
});
const prismaBlockVersionFindOneMock = jest.fn().mockImplementation(() => {
  return EXAMPLE_BLOCK_VERSION;
});

describe('BlockService', () => {
  let service: BlockService;
  prismaBlockFindOneMock.mockClear();
  prismaBlockFindManyMock.mockClear();
  prismaBlockVersionCreateMock.mockClear();
  prismaBlockVersionFindManyMock.mockClear();
  prismaBlockVersionFindOneMock.mockClear();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PrismaService,
          useClass: jest.fn().mockImplementation(() => ({
            block: {
              findOne: prismaBlockFindOneMock,
              findMany: prismaBlockFindManyMock
            },
            blockVersion: {
              create: prismaBlockVersionCreateMock,
              findMany: prismaBlockVersionFindManyMock,
              findOne: prismaBlockVersionFindOneMock
            }
          }))
        },
        BlockService
      ],
      imports: []
    }).compile();

    service = module.get<BlockService>(BlockService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates block correctly', async () => {
    const result = await service.create<JsonObject>({
      data: {
        app: {
          connect: {
            id: EXAMPLE_BLOCK.appId
          }
        },
        blockType: EnumBlockType[EXAMPLE_BLOCK.blockType],
        name: EXAMPLE_BLOCK.name,
        description: EXAMPLE_BLOCK.description,
        inputParameters: EXAMPLE_BLOCK_INPUT_LIST,
        outputParameters: EXAMPLE_BLOCK_INPUT_LIST,
        ...EXAMPLE_BLOCK_SETTINGS
      }
    });
    expect(result).toEqual(EXAMPLE_IBLOCK);
    expect(prismaBlockVersionCreateMock).toHaveBeenCalledTimes(1);
    expect(prismaBlockVersionCreateMock).toHaveBeenCalledWith({
      data: {
        label: NEW_VERSION_LABEL,
        versionNumber: EXAMPLE_BLOCK_VERSION.versionNumber,
        block: {
          create: {
            app: {
              connect: {
                id: EXAMPLE_APP.id
              }
            },
            blockType: EXAMPLE_BLOCK.blockType,
            description: EXAMPLE_BLOCK.description,
            name: EXAMPLE_BLOCK.name,
            parentBlock: undefined
          }
        },
        inputParameters: EXAMPLE_BLOCK_VERSION.inputParameters,
        outputParameters: EXAMPLE_BLOCK_VERSION.outputParameters,
        settings: EXAMPLE_BLOCK_VERSION.settings
      },
      include: {
        block: {
          include: {
            app: true,
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
      },
      version: EXAMPLE_BLOCK_VERSION.versionNumber
    });
    expect(result).toEqual(EXAMPLE_IBLOCK);
    expect(prismaBlockVersionFindOneMock).toHaveBeenCalledTimes(1);
    expect(prismaBlockVersionFindOneMock).toHaveBeenCalledWith({
      where: {
        // eslint-disable-next-line @typescript-eslint/camelcase
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
        block: {
          connect: {
            id: EXAMPLE_BLOCK.id
          }
        },
        label: NEW_VERSION_LABEL
      }
    });
    expect(result).toEqual(EXAMPLE_BLOCK_VERSION);

    expect(prismaBlockVersionFindManyMock).toHaveBeenCalledTimes(1);
    expect(prismaBlockVersionFindManyMock).toHaveBeenCalledWith({
      where: {
        block: { id: EXAMPLE_BLOCK.id }
      }
    });

    expect(prismaBlockVersionCreateMock).toHaveBeenCalledTimes(1);
    expect(prismaBlockVersionCreateMock).toHaveBeenCalledWith({
      data: {
        label: NEW_VERSION_LABEL,
        versionNumber: EXAMPLE_BLOCK_VERSION.versionNumber + 1,
        block: {
          connect: {
            id: EXAMPLE_BLOCK.id
          }
        },
        inputParameters: EXAMPLE_BLOCK_VERSION.inputParameters,
        outputParameters: EXAMPLE_BLOCK_VERSION.outputParameters,
        settings: EXAMPLE_BLOCK_VERSION.settings
      },
      select: {
        block: true,
        createdAt: true,
        id: true,
        label: true,
        updatedAt: true,
        versionNumber: true
      }
    });
  });
});
