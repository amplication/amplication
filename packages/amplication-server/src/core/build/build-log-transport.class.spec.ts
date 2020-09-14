import winston from 'winston';
import { BuildLogTransport } from './build-log-transport.class';

const EXAMPLE_BUILD_ID = 'EXAMPLE_BUILD_ID';
const EXAMPLE_LOG_MESSAGE = 'EXAMPLE_LOG_MESSAGE';
const EXAMPLE_META = {
  exampleKey: 'EXAMPLE_VALUE'
};

const buildUpdateMock = jest.fn(async () => {
  return;
});

describe('BuildLogTransport', () => {
  let transport: BuildLogTransport;
  beforeEach(() => {
    transport = new BuildLogTransport({
      buildId: EXAMPLE_BUILD_ID,
      prisma: {
        // eslint-disable-next-line
        // @ts-ignore
        build: {
          // eslint-disable-next-line
          // @ts-ignore
          update: buildUpdateMock
        }
      }
    });
    jest.clearAllMocks();
  });
  test('Writes log without meta', () => {
    const logger = winston.createLogger({
      transports: [transport]
    });
    logger.info(EXAMPLE_LOG_MESSAGE);
    expect(buildUpdateMock).toBeCalledTimes(1);
    expect(buildUpdateMock).toBeCalledWith({
      where: { id: EXAMPLE_BUILD_ID },
      data: {
        logs: {
          create: {
            level: 'Info',
            message: EXAMPLE_LOG_MESSAGE,
            meta: {}
          }
        }
      }
    });
  });
  test('Writes log with meta', () => {
    const logger = winston.createLogger({
      transports: [transport]
    });
    logger.info(EXAMPLE_LOG_MESSAGE, EXAMPLE_META);
    expect(buildUpdateMock).toBeCalledTimes(1);
    expect(buildUpdateMock).toBeCalledWith({
      where: { id: EXAMPLE_BUILD_ID },
      data: {
        logs: {
          create: {
            level: 'Info',
            message: EXAMPLE_LOG_MESSAGE,
            meta: EXAMPLE_META
          }
        }
      }
    });
  });
});
