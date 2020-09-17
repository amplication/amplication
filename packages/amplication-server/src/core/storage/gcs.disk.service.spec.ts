import { DriverType } from '@codebrew/nestjs-storage';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { GCSDiskService } from './gcs.disk.service';

const EXAMPLE_BUCKET_NAME = 'EXAMPLE_BUCKET_NAME';

const configServiceGetMock = jest.fn(() => EXAMPLE_BUCKET_NAME);

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
  });
  test('it gets disk', () => {
    expect(service.getDisk()).toEqual({
      driver: DriverType.GCS,
      config: {
        bucket: EXAMPLE_BUCKET_NAME,
        keyFilename: ''
      }
    });
  });
});
