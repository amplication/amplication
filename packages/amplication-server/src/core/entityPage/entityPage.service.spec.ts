import { Test, TestingModule } from '@nestjs/testing';
import { BlockService } from 'src/core/block/block.service';
import { EntityPageService } from './entityPage.service';
import { EntityService } from '../entity/entity.service';
import { EntityPage, EntityPageSingleRecordSettings } from './dto';
import { EnumBlockType } from 'src/enums/EnumBlockType';
import { JsonValue } from 'type-fest';

const EXAMPLE_INPUT_PARAMETERS = [];
const EXAMPLE_OUTPUT_PARAMETERS = [];
const EXAMPLE_NAME = 'Example Entity Page';
const EXAMPLE_APP_ID = 'ExampleApp';

const EXAMPLE_SINGLE_RECORD_SETTINGS: EntityPageSingleRecordSettings &
  JsonValue = {
  allowCreation: true,
  allowDeletion: true,
  allowUpdate: true,
  showAllFields: true
};

const EXAMPLE_ENTITY_PAGE: EntityPage = {
  id: 'ExampleEntityPage',
  updatedAt: new Date(),
  createdAt: new Date(),
  blockType: EnumBlockType.EntityPage,
  description: null,
  inputParameters: EXAMPLE_INPUT_PARAMETERS,
  outputParameters: EXAMPLE_OUTPUT_PARAMETERS,
  name: EXAMPLE_NAME,
  parentBlock: null,
  versionNumber: 0,
  entityId: 'ENTITY_ID',
  pageType: 'List',
  singleRecordSettings: EXAMPLE_SINGLE_RECORD_SETTINGS,
  listSettings: null
};

const EXAMPLE_ENTITY_PAGES = [EXAMPLE_ENTITY_PAGE];

const createMock = jest.fn(() => EXAMPLE_ENTITY_PAGE);
const findOneMock = jest.fn(() => EXAMPLE_ENTITY_PAGE);
const findManyByBlockTypeMock = jest.fn(() => EXAMPLE_ENTITY_PAGES);

const isPersistentEntityInSameAppMock = jest.fn(() => true);
const validateAllFieldsExistMock = jest.fn(() => true);

describe('EntityPageService', () => {
  let service: EntityPageService;

  beforeEach(async () => {
    createMock.mockClear();
    findOneMock.mockClear();
    findManyByBlockTypeMock.mockClear();
    isPersistentEntityInSameAppMock.mockClear();
    validateAllFieldsExistMock.mockClear();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: BlockService,
          useClass: jest.fn(() => ({
            create: createMock,
            findOne: findOneMock,
            findManyByBlockType: findManyByBlockTypeMock
          }))
        },
        {
          provide: EntityService,
          useClass: jest.fn(() => ({
            isPersistentEntityInSameApp: isPersistentEntityInSameAppMock,
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
    expect(
      await service.findOne({
        where: { id: EXAMPLE_ENTITY_PAGE.id },
        version: EXAMPLE_ENTITY_PAGE.versionNumber
      })
    ).toBe(EXAMPLE_ENTITY_PAGE);
    expect(findOneMock).toBeCalledTimes(1);
  });

  it('should find many', async () => {
    expect(await service.findMany({})).toEqual(EXAMPLE_ENTITY_PAGES);
    expect(findManyByBlockTypeMock).toBeCalledTimes(1);
  });

  it('should create', async () => {
    expect(
      await service.create({
        data: {
          inputParameters: EXAMPLE_INPUT_PARAMETERS,
          outputParameters: EXAMPLE_OUTPUT_PARAMETERS,
          name: EXAMPLE_NAME,
          entityId: EXAMPLE_ENTITY_PAGE.entityId,
          pageType: EXAMPLE_ENTITY_PAGE.pageType,
          singleRecordSettings: EXAMPLE_SINGLE_RECORD_SETTINGS,
          app: {
            connect: {
              id: EXAMPLE_APP_ID
            }
          }
        }
      })
    ).toEqual(EXAMPLE_ENTITY_PAGE);
    expect(createMock).toBeCalledTimes(1);
  });
});
