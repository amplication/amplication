import { ILogger } from "../../src/lib/types";

export const MockedLogger: ILogger = {
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  child: jest.fn(() => MockedLogger),
};
