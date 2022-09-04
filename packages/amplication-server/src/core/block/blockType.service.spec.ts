import { Test, TestingModule } from '@nestjs/testing';
import { BlockTypeService } from './blockType.service';
import { BlockService } from './block.service';
import { EnumBlockType } from 'src/enums/EnumBlockType';
import { IBlock, BlockInputOutput, Block, User } from 'src/models';
import { FindManyBlockTypeArgs, CreateBlockArgs, UpdateBlockArgs } from './dto';
import { FindOneArgs } from 'src/dto';

const EXAMPLE_IBLOCK_ID = 'exampleIblockId';
const EXAMPLE_DISPLAY_NAME = 'exampleDisplayName';
const EXAMPLE_DESCRIPTION = 'exampleDescription';
const EXAMPLE_VERSION_NUMBER = 1;

const EXAMPLE_BLOCK_ID = 'exampleBlockId';

const EXAMPLE_INPUT_OUTPUT_NAME = 'exampleInputOutputName';

const EXAMPLE_BLOCK_INPUT_OUTPUT: BlockInputOutput = {
  name: EXAMPLE_INPUT_OUTPUT_NAME
};
const EXAMPLE_RESOURCE_ID = 'exampleResourceId';
const EXAMPLE_BLOCK_TYPE = EnumBlockType.ConnectorRestApi;
const EXAMPLE_USER_ID = 'exampleUserId';
const EXAMPLE_WORKSPACE_ID = 'exampleWorkspaceId';

const EXAMPLE_BLOCK: Block = {
  id: EXAMPLE_BLOCK_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  displayName: EXAMPLE_DISPLAY_NAME,
  blockType: EXAMPLE_BLOCK_TYPE,
  resourceId: EXAMPLE_RESOURCE_ID
};

const EXAMPLE_IBLOCK: IBlock = {
  id: EXAMPLE_IBLOCK_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  parentBlock: EXAMPLE_BLOCK,
  displayName: EXAMPLE_DISPLAY_NAME,
  description: EXAMPLE_DESCRIPTION,
  blockType: EXAMPLE_BLOCK_TYPE,
  versionNumber: EXAMPLE_VERSION_NUMBER,
  inputParameters: [EXAMPLE_BLOCK_INPUT_OUTPUT],
  outputParameters: [EXAMPLE_BLOCK_INPUT_OUTPUT]
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

const blockServiceFindOneMock = jest.fn(() => {
  return EXAMPLE_IBLOCK;
});

const blockServiceFindManyByBlockTypeMock = jest.fn(() => {
  return [EXAMPLE_IBLOCK];
});

const blockServiceCreateMock = jest.fn(() => {
  return EXAMPLE_IBLOCK;
});

const blockServiceUpdateMock = jest.fn(() => {
  return EXAMPLE_IBLOCK;
});

describe('BlockTypeService', () => {
  let service: BlockTypeService<
    IBlock,
    FindManyBlockTypeArgs,
    CreateBlockArgs,
    UpdateBlockArgs
  >;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: BlockService,
          useClass: jest.fn(() => ({
            findOne: blockServiceFindOneMock,
            findManyByBlockType: blockServiceFindManyByBlockTypeMock,
            create: blockServiceCreateMock,
            update: blockServiceUpdateMock
          }))
        },
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        BlockTypeService
      ],
      imports: []
    }).compile();

    service = module.get<
      BlockTypeService<
        IBlock,
        FindManyBlockTypeArgs,
        CreateBlockArgs,
        UpdateBlockArgs
      >
    >(BlockTypeService);

    service.blockType = EnumBlockType.ConnectorRestApi;
  });

  it('should find a block service', async () => {
    const args: FindOneArgs = {
      where: { id: EXAMPLE_IBLOCK_ID }
    };
    expect(await service.findOne(args)).toEqual(EXAMPLE_IBLOCK);
    expect(blockServiceFindOneMock).toBeCalledTimes(1);
    expect(blockServiceFindOneMock).toBeCalledWith(args);
  });

  it('should find many block services', async () => {
    const args: FindManyBlockTypeArgs = {};
    expect(await service.findMany(args)).toEqual([EXAMPLE_IBLOCK]);
    expect(blockServiceFindManyByBlockTypeMock).toBeCalledTimes(1);
    expect(blockServiceFindManyByBlockTypeMock).toBeCalledWith(
      args,
      service.blockType
    );
  });

  it('should create a block service', async () => {
    const args: CreateBlockArgs = {
      data: {
        displayName: EXAMPLE_DISPLAY_NAME,
        resource: { connect: { id: EXAMPLE_RESOURCE_ID } }
      }
    };
    const createArgs = {
      ...args,
      data: {
        ...args.data,
        blockType: service.blockType
      }
    };
    expect(await service.create(args, EXAMPLE_USER)).toEqual(EXAMPLE_IBLOCK);
    expect(blockServiceCreateMock).toBeCalledTimes(1);
    expect(blockServiceCreateMock).toBeCalledWith(createArgs, EXAMPLE_USER.id);
  });

  it('should update a block service', async () => {
    const args: UpdateBlockArgs = {
      data: {},
      where: { id: EXAMPLE_IBLOCK_ID }
    };
    expect(await service.update(args, EXAMPLE_USER)).toEqual(EXAMPLE_IBLOCK);
    expect(blockServiceUpdateMock).toBeCalledTimes(1);
    expect(blockServiceUpdateMock).toBeCalledWith(args, EXAMPLE_USER);
  });
});
