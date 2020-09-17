import { DriverType } from '@codebrew/nestjs-storage';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { GCSDiskService, GCS_BUCKET_VAR } from './gcs.disk.service';

const EXAMPLE_BUCKET_NAME = 'EXAMPLE_BUCKET_NAME';

const configServiceGetMock = jest.fn();

describe('GCSDiskService', () => {
  let service: GCSDiskService;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: ConfigService,
          useValue: {
            get: configServiceGetMock
          }
        },
        GCSDiskService
      ]
    }).compile();
    service = module.get<GCSDiskService>(GCSDiskService);
    jest.clearAllMocks();
  });
  test('gets disk if bucket is defined', () => {
    configServiceGetMock.mockImplementation(() => EXAMPLE_BUCKET_NAME);
    expect(service.getDisk()).toEqual({
      driver: DriverType.GCS,
      config: {
        bucket: EXAMPLE_BUCKET_NAME,
        keyFilename: ''
      }
    });
    expect(configServiceGetMock).toBeCalledTimes(1);
    expect(configServiceGetMock).toBeCalledWith(GCS_BUCKET_VAR);
  });
  test('gets null if bucket is not defined', () => {
    configServiceGetMock.mockImplementation(() => null);
    expect(service.getDisk()).toEqual(null);
    expect(configServiceGetMock).toBeCalledTimes(1);
    expect(configServiceGetMock).toBeCalledWith(GCS_BUCKET_VAR);
  });
});
