import { AmplicationLogger } from "../../src/logger.service";

export const MockedAmplicationLoggerProvider = {
  provide: AmplicationLogger,
  useClass: jest.fn(() => ({
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    child: jest.fn(),
  })),
};
