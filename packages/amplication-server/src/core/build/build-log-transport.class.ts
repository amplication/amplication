import Transport from 'winston-transport';
import { LEVEL, MESSAGE, SPLAT } from 'triple-beam';
import { BuildLogLevel, PrismaClient } from '@prisma/client';
import omit from 'lodash.omit';

const WINSTON_LEVEL_TO_BUILD_LOG_LEVEL: { [level: string]: BuildLogLevel } = {
  error: 'Error',
  warn: 'Warning',
  info: 'Info',
  debug: 'Debug'
};

const META_KEYS_TO_OMIT = [LEVEL, MESSAGE, SPLAT];

export class BuildLogTransport extends Transport {
  buildId: string;
  prisma: PrismaClient;
  constructor(
    opts: Transport.TransportStreamOptions & {
      buildId: string;
      prisma: PrismaClient;
    }
  ) {
    super(opts);
    this.buildId = opts.buildId;
    this.prisma = opts.prisma;
  }
  log(info, callback: () => void) {
    const { message, level, ...meta } = info;
    this.prisma.build
      .update({
        where: { id: this.buildId },
        data: {
          logs: {
            create: {
              level: WINSTON_LEVEL_TO_BUILD_LOG_LEVEL[level],
              meta: omit(meta, META_KEYS_TO_OMIT),
              message
            }
          }
        }
      })
      .then(callback);
  }
}
