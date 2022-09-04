import { Test, TestingModule } from '@nestjs/testing';
import { BlockService } from 'src/core/block/block.service';
import { ServiceSettingsService } from './serviceSettings.service';
import { ServiceSettings } from './dto';
import { EnumBlockType } from 'src/enums/EnumBlockType';
import { DEFAULT_SERVICE_SETTINGS } from './constants';
import { User } from 'src/models';
import { EnumAuthProviderType } from './dto/EnumAuthenticationProviderType';

const EXAMPLE_INPUT_PARAMETERS = [];
const EXAMPLE_OUTPUT_PARAMETERS = [];
const EXAMPLE_NAME = 'Example Resource Settings';
const EXAMPLE_RESOURCE_ID = 'ExampleResource';

const EXAMPLE_USER_ID = 'exampleUserId';
const EXAMPLE_WORKSPACE_ID = 'exampleWorkspaceId';

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

const EXAMPLE_SERVICE_SETTINGS: ServiceSettings = {
  id: 'ExampleServiceSettings',
  updatedAt: new Date(),
  createdAt: new Date(),
  blockType: EnumBlockType.ServiceSettings,
  description: null,
  inputParameters: EXAMPLE_INPUT_PARAMETERS,
  outputParameters: EXAMPLE_OUTPUT_PARAMETERS,
  displayName: EXAMPLE_NAME,
  parentBlock: null,
  versionNumber: 0,
  dbHost: 'localhost',
  dbName: 'myDb',
  dbPassword: '1234',
  dbPort: 5432,
  dbUser: 'admin',
  authProvider: EnumAuthProviderType.Http,
  serverSettings: {
    generateGraphQL: true,
    generateRestApi: true,
    serverPath: ''
  },
  adminUISettings: {
    generateAdminUI: true,
    adminUIPath: ''
  }
};

const createMock = jest.fn(() => {
  return { ...EXAMPLE_SERVICE_SETTINGS, ...DEFAULT_SERVICE_SETTINGS };
});
const findOneMock = jest.fn(() => EXAMPLE_SERVICE_SETTINGS);
const findManyByBlockTypeMock = jest.fn(() => [EXAMPLE_SERVICE_SETTINGS]);
const updateMock = jest.fn(() => EXAMPLE_SERVICE_SETTINGS);

describe('ServiceSettingsService', () => {
  let service: ServiceSettingsService;

  beforeEach(async () => {
    createMock.mockClear();
    findOneMock.mockClear();
    findManyByBlockTypeMock.mockClear();

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
        ServiceSettingsService
      ],
      imports: []
    }).compile();

    service = module.get<ServiceSettingsService>(ServiceSettingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find one', async () => {
    expect(
      await service.getServiceSettingsBlock(
        {
          where: { id: EXAMPLE_RESOURCE_ID }
        },
        EXAMPLE_USER
      )
    ).toEqual(EXAMPLE_SERVICE_SETTINGS);
    expect(findManyByBlockTypeMock).toBeCalledTimes(1);
  });

  it('should create default', async () => {
    expect(
      await service.createDefaultServiceSettings(
        EXAMPLE_RESOURCE_ID,
        EXAMPLE_USER
      )
    ).toEqual({
      ...EXAMPLE_SERVICE_SETTINGS,
      ...DEFAULT_SERVICE_SETTINGS
    });
    expect(createMock).toBeCalledTimes(1);
  });

  it('should update', async () => {
    expect(
      await service.updateServiceSettings(
        {
          data: {
            ...EXAMPLE_SERVICE_SETTINGS
          },
          where: {
            id: EXAMPLE_RESOURCE_ID
          }
        },
        EXAMPLE_USER
      )
    ).toEqual(EXAMPLE_SERVICE_SETTINGS);
    expect(findManyByBlockTypeMock).toBeCalledTimes(1);
    expect(updateMock).toBeCalledTimes(1);
  });
});
