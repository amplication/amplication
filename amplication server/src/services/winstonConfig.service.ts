import {
  Injectable,
  Request,
  Inject,
  Scope,
  ExecutionContext
} from '@nestjs/common';
import {
  WinstonModuleOptionsFactory,
  WinstonModuleOptions
} from 'nest-winston';
import * as winston from 'winston';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CONTEXT } from '@nestjs/graphql';

@Injectable({ scope: Scope.REQUEST })
export class WinstonConfigService implements WinstonModuleOptionsFactory {
  constructor(
    private configService: ConfigService,
    @Inject(CONTEXT) private readonly context
  ) {}

  getUserId() {
    const { user, ip } = this.context.req;

    return user.id + ' ' + ip;
  }

  createWinstonModuleOptions():
    | Promise<WinstonModuleOptions>
    | WinstonModuleOptions {
    return {
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),

      //defaultMeta: { IPAddrss: 'Alon' },
      transports: [
        // write to console
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize()
          )
        }),
        // // - Write all logs with level `error` and below to `error.log`
        // new winston.transports.File({
        //   filename: 'error.log',
        //   level: 'error'
        // }),
        // // - Write all logs with level `info` and below to `combined.log`
        // new winston.transports.File({
        //   filename: 'combined.log'
        // })
      ]
    };
  }
}
