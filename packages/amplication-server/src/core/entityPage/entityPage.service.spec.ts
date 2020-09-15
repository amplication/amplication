import { Test, TestingModule } from '@nestjs/testing';
import { BlockService } from 'src/core/block/block.service';
import { EntityPageService } from './entityPage.service';
import { EntityService } from '../entity/entity.service';
import { EnumBlockType } from 'src/enums/EnumBlockType';
import { EntityPageSingleRecordSettings } from './dto/EntityPageSingleRecordSettings';
import { EntityPageListSettings } from './dto/EntityPageListSettings';
import { JsonValue } from 'type-fest';
import { EnumEntityPageType } from './dto/EnumEntityPageType';
import { EntityPage } from './dto/EntityPage';
import { EntityPageCreateInput } from './dto/EntityPageCreateInput';

const EXAMPLE_INPUT_PARAMETERS = [];
const EXAMPLE_OUTPUT_PARAMETERS = [];
const EXAMPLE_SINGLE_RECORD_NAME = 'Example Single Record Entity Page';
const EXAMPLE_LIST_NAME = 'Example List Entity Page';
const EXAMPLE_APP_ID = 'ExampleApp';
const EXAMPLE_ENTITY_ID = 'ExampleEntityId';
const NOW = new Date();
const VERSION_NUMBER = 0;

const EXAMPLE_SINGLE_RECORD_SETTINGS: EntityPageSingleRecordSettings &
  JsonValue = {
  allowCreation: true,
  allowDeletion: true,
  allowUpdate: true
};

const EXAMPLE_LIST_SETTINGS: EntityPageListSettings & JsonValue = {
  allowCreation: true,
  allowDeletion: true,
  enableSearch: false,
  navigateToPageId: 'ExamplePageId'
};

const EXAMPLE_SINGLE_RECORD_ENTITY_PAGE: EntityPage = {
  id: 'ExampleSingleRecordEntityPage',
  updatedAt: NOW,
  createdAt: NOW,
  blockType: EnumBlockType.EntityPage,
  description: null,
  inputParameters: EXAMPLE_INPUT_PARAMETERS,
  outputParameters: EXAMPLE_OUTPUT_PARAMETERS,
  displayName: EXAMPLE_SINGLE_RECORD_NAME,
  parentBlock: null,
  versionNumber: VERSION_NUMBER,
  entityId: EXAMPLE_ENTITY_ID,
  pageType: EnumEntityPageType.SingleRecord,
  listSettings: null,
  singleRecordSettings: EXAMPLE_SINGLE_RECORD_SETTINGS,
  showAllFields: true
};

const EXAMPLE_LIST_ENTITY_PAGE: EntityPage = {
  id: 'ExampleListEntityPage',
  updatedAt: NOW,
  createdAt: NOW,
  blockType: EnumBlockType.EntityPage,
  description: null,
  inputParameters: EXAMPLE_INPUT_PARAMETERS,
  outputParameters: EXAMPLE_OUTPUT_PARAMETERS,
  displayName: EXAMPLE_LIST_NAME,
  parentBlock: null,
  versionNumber: VERSION_NUMBER,
  entityId: EXAMPLE_ENTITY_ID,
  pageType: EnumEntityPageType.List,
  listSettings: EXAMPLE_LIST_SETTINGS,
  showAllFields: true
};

const SINGLE_RECORD_CREATE_INPUT: EntityPageCreateInput = {
  blockType: EnumBlockType.EntityPage,
  inputParameters: EXAMPLE_INPUT_PARAMETERS,
  outputParameters: EXAMPLE_OUTPUT_PARAMETERS,
  displayName: EXAMPLE_SINGLE_RECORD_NAME,
  entityId: EXAMPLE_ENTITY_ID,
  pageType: EnumEntityPageType.SingleRecord,
  showAllFields: true,
  singleRecordSettings: EXAMPLE_SINGLE_RECORD_SETTINGS,
  app: {
    connect: {
      id: EXAMPLE_APP_ID
    }
  }
};

const LIST_CREATE_INPUT: EntityPageCreateInput = {
  blockType: EnumBlockType.EntityPage,
  inputParameters: EXAMPLE_INPUT_PARAMETERS,
  outputParameters: EXAMPLE_OUTPUT_PARAMETERS,
  displayName: EXAMPLE_LIST_NAME,
  entityId: EXAMPLE_ENTITY_ID,
  pageType: EnumEntityPageType.List,
  showAllFields: true,
  listSettings: EXAMPLE_LIST_SETTINGS,
  app: {
    connect: {
      id: EXAMPLE_APP_ID
    }
  }
};

const EXAMPLE_ENTITY_PAGES = [EXAMPLE_SINGLE_RECORD_ENTITY_PAGE];

const createMock = jest.fn(args => {
  switch (args.data.displayName) {
    case EXAMPLE_SINGLE_RECORD_NAME:
      return EXAMPLE_SINGLE_RECORD_ENTITY_PAGE;
    case EXAMPLE_LIST_NAME:
      return EXAMPLE_LIST_ENTITY_PAGE;
    default:
      throw new Error();
  }
});
const updateMock = jest.fn(() => {
  return EXAMPLE_LIST_ENTITY_PAGE;
});
const findOneMock = jest.fn(() => EXAMPLE_SINGLE_RECORD_ENTITY_PAGE);
const findManyByBlockTypeMock = jest.fn(() => EXAMPLE_ENTITY_PAGES);

const isEntityInSameAppMock = jest.fn(() => true);
const validateAllFieldsExistMock = jest.fn(() => true);

describe('EntityPageService', () => {
  let service: EntityPageService;

  beforeEach(async () => {
    createMock.mockClear();
    findOneMock.mockClear();
    findManyByBlockTypeMock.mockClear();
    isEntityInSameAppMock.mockClear();
    validateAllFieldsExistMock.mockClear();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: BlockService,
          useClass: jest.fn(() => ({
            create: createMock,
            findOne: findOneMock,
            findManyByBlockType: findManyByBlockTypeMock,
            update: updateMock
          }))
        },
        {
          provide: EntityService,
          useClass: jest.fn(() => ({
            isEntityInSameApp: isEntityInSameAppMock,
            validateAllFieldsExist: validateAllFieldsExistMock
          }))
        },
        EntityPageService
      ],
      imports: []
    }).compile();

    service = module.get<EntityPageService>(EntityPageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find one', async () => {
    const args = {
      where: { id: EXAMPLE_SINGLE_RECORD_ENTITY_PAGE.id },
      version: EXAMPLE_SINGLE_RECORD_ENTITY_PAGE.versionNumber
    };
    expect(await service.findOne(args)).toBe(EXAMPLE_SINGLE_RECORD_ENTITY_PAGE);
    expect(findOneMock).toBeCalledTimes(1);
    expect(findOneMock).toBeCalledWith(args);
  });

  it('should find many', async () => {
    expect(await service.findMany({})).toEqual(EXAMPLE_ENTITY_PAGES);
    expect(findManyByBlockTypeMock).toBeCalledTimes(1);
    expect(findManyByBlockTypeMock).toBeCalledWith(
      {},
      EXAMPLE_SINGLE_RECORD_ENTITY_PAGE.blockType
    );
  });

  it('should create single record entity page', async () => {
    const args = {
      data: SINGLE_RECORD_CREATE_INPUT
    };
    expect(await service.create(args)).toEqual(
      EXAMPLE_SINGLE_RECORD_ENTITY_PAGE
    );
    expect(createMock).toBeCalledTimes(1);
    expect(createMock).toBeCalledWith(args);
  });

  it('should create list entity page', async () => {
    const args = {
      data: LIST_CREATE_INPUT
    };
    expect(await service.create(args)).toEqual(EXAMPLE_LIST_ENTITY_PAGE);
    expect(createMock).toBeCalledTimes(1);
    expect(createMock).toBeCalledWith(args);
  });

  it('should update an entity page', async () => {
    const args = {
      data: {
        entityId: EXAMPLE_ENTITY_ID,
        pageType: EnumEntityPageType.List,
        showAllFields: true
      },
      where: { id: EXAMPLE_ENTITY_ID }
    };
    expect(await service.update(args)).toEqual(EXAMPLE_LIST_ENTITY_PAGE);
    expect(updateMock).toBeCalledTimes(1);
    expect(updateMock).toBeCalledWith(args);
  });
});
