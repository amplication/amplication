import { Test, TestingModule } from '@nestjs/testing';
import { BlockService } from './block.service';
import { PrismaService } from 'src/services/prisma.service';
import { Block, BlockVersion } from '@prisma/client';
import { EnumBlockType } from 'src/enums/EnumBlockType';
import { Block as BlockModel } from 'src/models';

const NEW_VERSION_LABEL = 'Current Version';

const EXAMPLE_BLOCK: Block = {
  id: 'ExampleBlock',
  createdAt: new Date(),
  updatedAt: new Date(),
  appId: 'ExampleApp',
  blockType: EnumBlockType.ConnectorRestApiCall,
  name: 'Example Block',
  description: 'Block Description'
};

const EXAMPLE_BLOCK_VERSION: BlockVersion = {
  id: 'ExampleBlockVersion',
  createdAt: new Date(),
  updatedAt: new Date(),
  blockId: 'ExampleBlock',
  versionNumber: 0,
  label: 'Block Version Label',
  inputParameters: '{}',
  outputParameters: '{}',
  configuration: '{}'
};

const EXAMPLE_BLOCK_WITH_VERSION: BlockModel = {
  id: EXAMPLE_BLOCK.id,
  createdAt: EXAMPLE_BLOCK.createdAt,
  appId: EXAMPLE_BLOCK.appId,
  updatedAt: EXAMPLE_BLOCK.updatedAt,
  blockType: EnumBlockType.ConnectorRestApiCall,
  name: EXAMPLE_BLOCK.name,
  description: EXAMPLE_BLOCK.description,
  versionNumber: EXAMPLE_BLOCK_VERSION.versionNumber,
  configuration: EXAMPLE_BLOCK_VERSION.configuration,
  inputParameters: EXAMPLE_BLOCK_VERSION.inputParameters,
  outputParameters: EXAMPLE_BLOCK_VERSION.outputParameters
};

const prismaBlockCreateMock = jest.fn().mockImplementation(() => {
  return EXAMPLE_BLOCK;
});
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

describe('BlockService', () => {
  let service: BlockService;
  prismaBlockCreateMock.mockClear();
  prismaBlockFindOneMock.mockClear();
  prismaBlockFindManyMock.mockClear();
  prismaBlockVersionCreateMock.mockClear();
  prismaBlockVersionFindManyMock.mockClear();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PrismaService,
          useClass: jest.fn().mockImplementation(() => ({
            block: {
              create: prismaBlockCreateMock,
              findOne: prismaBlockFindOneMock,
              findMany: prismaBlockFindManyMock
            },
            blockVersion: {
              create: prismaBlockVersionCreateMock,
              findMany: prismaBlockVersionFindManyMock
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
    const result = await service.create({
      data: {
        app: {
          connect: {
            id: EXAMPLE_BLOCK.appId
          }
        },
        blockType: EXAMPLE_BLOCK.blockType,
        name: EXAMPLE_BLOCK.name,
        description: EXAMPLE_BLOCK.description,
        configuration: EXAMPLE_BLOCK_VERSION.configuration
      }
    });
    expect(result).toBe(EXAMPLE_BLOCK);
    expect(prismaBlockCreateMock).toHaveBeenCalledTimes(1);
    expect(prismaBlockCreateMock).toHaveBeenCalledWith({
      data: {
        name: EXAMPLE_BLOCK.name,
        description: EXAMPLE_BLOCK.description,
        app: {
          connect: {
            id: EXAMPLE_BLOCK.appId
          }
        },
        blockType: EXAMPLE_BLOCK.blockType
      }
    });
    expect(prismaBlockVersionCreateMock).toHaveBeenCalledTimes(1);
    expect(prismaBlockVersionCreateMock).toHaveBeenCalledWith({
      data: {
        label: NEW_VERSION_LABEL,
        versionNumber: 0,
        block: {
          connect: {
            id: EXAMPLE_BLOCK.id
          }
        },
        inputParameters: JSON.stringify({}),
        outputParameters: JSON.stringify({}),
        configuration: EXAMPLE_BLOCK_VERSION.configuration
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
    expect(result).toEqual(EXAMPLE_BLOCK_WITH_VERSION);
    expect(prismaBlockVersionFindManyMock).toHaveBeenCalledTimes(1);
    expect(prismaBlockVersionFindManyMock).toHaveBeenCalledWith({
      where: {
        block: { id: EXAMPLE_BLOCK.id },
        versionNumber: EXAMPLE_BLOCK_VERSION.versionNumber
      }
    });
    expect(prismaBlockFindOneMock).toHaveBeenCalledTimes(1);
    expect(prismaBlockFindOneMock).toHaveBeenCalledWith({
      where: {
        id: EXAMPLE_BLOCK.id
      }
    });
  });
});
