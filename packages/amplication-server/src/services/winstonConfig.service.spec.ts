import { TestingModule, Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';
import { WinstonConfigService, LEVEL } from './winstonConfig.service';

const getMock = jest.fn();

describe('WinstonConfigService', () => {
  let service: WinstonConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WinstonConfigService,
        { provide: ConfigService, useValue: { get: getMock } }
      ]
    }).compile();

    service = module.get<WinstonConfigService>(WinstonConfigService);
  });

  it('should return development config by default', () => {
    expect(service.createWinstonModuleOptions()).toEqual({
      level: LEVEL,
      format: service.developmentFormat,
      transports: [expect.any(winston.transports.Console)]
    });
  });

  it('should return production config if NODE_ENV is set to "production"', () => {
    getMock.mockImplementation(() => 'production');
    expect(service.createWinstonModuleOptions()).toEqual({
      level: LEVEL,
      format: service.productionFormat,
      transports: [expect.any(winston.transports.Console)]
    });
  });
});
