import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';
import {
  WinstonModuleOptionsFactory,
  WinstonModuleOptions
} from 'nest-winston';

@Injectable()
export class WinstonConfigService implements WinstonModuleOptionsFactory {
  constructor(private readonly configService: ConfigService) {}
  createWinstonModuleOptions(): WinstonModuleOptions {
    return {
      level: 'info',
      format:
        this.configService.get('NODE_ENV') === 'production'
          ? winston.format.combine(
              winston.format.errors({ stack: true }),
              winston.format.timestamp(),
              winston.format.json()
            )
          : winston.format.combine(
              winston.format.errors({ stack: true }),
              winston.format.timestamp(),
              winston.format.colorize(),
              winston.format.simple()
            ),
      transports: [new winston.transports.Console()]
    };
  }
}
