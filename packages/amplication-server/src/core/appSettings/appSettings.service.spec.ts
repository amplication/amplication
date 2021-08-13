import { Test, TestingModule } from '@nestjs/testing';
import { BlockService } from 'src/core/block/block.service';
import { AppSettingsService } from './appSettings.service';
import { AppSettings } from './dto';
import { EnumBlockType } from 'src/enums/EnumBlockType';
import { DEFAULT_APP_SETTINGS } from './constants';
import { User } from 'src/models';
import { EnumAuthProviderType } from './dto/EnumAuthenticationProviderType';

const EXAMPLE_INPUT_PARAMETERS = [];
const EXAMPLE_OUTPUT_PARAMETERS = [];
const EXAMPLE_NAME = 'Example App Settings';
const EXAMPLE_APP_ID = 'ExampleApp';

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
  }
};

const EXAMPLE_APP_SETTINGS: AppSettings = {
  id: 'ExampleAppSettings',
  updatedAt: new Date(),
  createdAt: new Date(),
  blockType: EnumBlockType.AppSettings,
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
  appUserName: 'admin',
  appPassword: 'admin'
};

const createMock = jest.fn(() => {
  return { ...EXAMPLE_APP_SETTINGS, ...DEFAULT_APP_SETTINGS };
});
const findOneMock = jest.fn(() => EXAMPLE_APP_SETTINGS);
const findManyByBlockTypeMock = jest.fn(() => [EXAMPLE_APP_SETTINGS]);
const updateMock = jest.fn(() => EXAMPLE_APP_SETTINGS);

describe('AppSettingsService', () => {
  let service: AppSettingsService;

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
        AppSettingsService
      ],
      imports: []
    }).compile();

    service = module.get<AppSettingsService>(AppSettingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find one', async () => {
    expect(
      await service.getAppSettingsBlock(
        {
          where: { id: EXAMPLE_APP_ID }
        },
        EXAMPLE_USER
      )
    ).toBe(EXAMPLE_APP_SETTINGS);
    expect(findManyByBlockTypeMock).toBeCalledTimes(1);
  });

  it('should create default', async () => {
    expect(
      await service.createDefaultAppSettings(EXAMPLE_APP_ID, EXAMPLE_USER)
    ).toEqual({
      ...EXAMPLE_APP_SETTINGS,
      ...DEFAULT_APP_SETTINGS
    });
    expect(createMock).toBeCalledTimes(1);
  });

  it('should update', async () => {
    expect(
      await service.updateAppSettings(
        {
          data: {
            ...EXAMPLE_APP_SETTINGS
          },
          where: {
            id: EXAMPLE_APP_ID
          }
        },
        EXAMPLE_USER
      )
    ).toEqual(EXAMPLE_APP_SETTINGS);
    expect(findManyByBlockTypeMock).toBeCalledTimes(1);
    expect(updateMock).toBeCalledTimes(1);
  });
});
