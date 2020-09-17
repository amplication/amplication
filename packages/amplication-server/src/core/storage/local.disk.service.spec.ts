import { DriverType } from '@codebrew/nestjs-storage';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { LocalDiskService, LOCAL_DISK_ROOT_VAR } from './local.disk.service';

const EXAMPLE_ROOT = 'EXAMPLE_ROOT';

const configServiceGetMock = jest.fn();

describe('LocalDiskService', () => {
  let service: LocalDiskService;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: ConfigService,
          useValue: {
            get: configServiceGetMock
          }
        },
        LocalDiskService
      ]
    }).compile();
    service = module.get<LocalDiskService>(LocalDiskService);
    jest.clearAllMocks();
  });
  test('gets disk if root is defined', () => {
    configServiceGetMock.mockImplementation(() => EXAMPLE_ROOT);
    expect(service.getDisk()).toEqual({
      driver: DriverType.LOCAL,
      config: {
        root: EXAMPLE_ROOT
      }
    });
    expect(configServiceGetMock).toBeCalledTimes(1);
    expect(configServiceGetMock).toBeCalledWith(LOCAL_DISK_ROOT_VAR);
  });
  test('gets null if bucket is not defined', () => {
    configServiceGetMock.mockImplementation(() => null);
    expect(service.getDisk()).toEqual(null);
    expect(configServiceGetMock).toBeCalledTimes(1);
    expect(configServiceGetMock).toBeCalledWith(LOCAL_DISK_ROOT_VAR);
  });
});
