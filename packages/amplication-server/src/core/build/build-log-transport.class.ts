import Transport from 'winston-transport';
import { BuildLogLevel, PrismaClient } from '@prisma/client';

const WINSTON_LEVEL_TO_BUILD_LOG_LEVEL: { [level: string]: BuildLogLevel } = {
  error: 'Error',
  warn: 'Warning',
  info: 'Info',
  debug: 'Debug'
};

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
    this.prisma.build
      .update({
        where: { id: this.buildId },
        data: {
          logs: {
            create: {
              level: WINSTON_LEVEL_TO_BUILD_LOG_LEVEL[info.level],
              message: info.message,
              meta: info.meta
            }
          }
        }
      })
      .then(callback);
  }
}
