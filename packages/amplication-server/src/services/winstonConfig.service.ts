import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';
import {
  WinstonModuleOptionsFactory,
  WinstonModuleOptions
} from 'nest-winston';
import * as winstonCloudLogging from 'winston-cloud-logging';

export const LEVEL = 'info';

/**
 * Defines configuration for logging
 */
@Injectable()
export class WinstonConfigService implements WinstonModuleOptionsFactory {
  constructor(private readonly configService: ConfigService) {}
  readonly developmentFormat = winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.timestamp(),
    winston.format.colorize(),
    winston.format.simple()
  );
  readonly productionFormat = winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.timestamp(),
    winstonCloudLogging.format(),
    winston.format.json()
  );
  createWinstonModuleOptions(): WinstonModuleOptions {
    return {
      level: LEVEL,
      format:
        this.configService.get('NODE_ENV') === 'production'
          ? this.productionFormat
          : this.developmentFormat,
      transports: [new winston.transports.Console()]
    };
  }
}
