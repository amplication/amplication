import {
  WinstonModuleOptionsFactory,
  WinstonModuleOptions
} from 'nest-winston';
import * as winston from 'winston';
import { ConfigService } from '@nestjs/config';

const DEV = process.env.NODE_ENV === 'development';

//@Injectable({ scope: Scope.REQUEST })
export class WinstonConfigService implements WinstonModuleOptionsFactory {
  constructor(private configService: ConfigService) {}

  createWinstonModuleOptions():
    | Promise<WinstonModuleOptions>
    | WinstonModuleOptions {
    return {
      level: 'info',
      format: winston.format.combine(
        winston.format.errors({ stack: true }),
        winston.format.timestamp(),
        DEV ? winston.format.prettyPrint() : winston.format.json()
      ),

      //defaultMeta: { IPAddrss: 'Alon' },
      transports: [
        // write to console
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize()
          )
        })
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
