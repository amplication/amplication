import { Logger } from "./logging";
import { LoggerOptions, LogLevel } from "./types";
import * as winston from "winston";

jest.mock("winston", () => ({
  format: {
    colorize: jest.fn().mockReturnValue("colorize"),
    errors: jest.fn().mockReturnValue("errors"),
    simple: jest.fn().mockReturnValue("simple"),
    json: jest.fn().mockReturnValue("json"),
    timestamp: jest.fn().mockReturnValue("timestamp"),
    combine: jest.fn().mockImplementation((...args) => args),
    label: jest.fn(),
    printf: jest.fn(),
  },
  createLogger: jest.fn(),
  transports: {
    Console: jest.fn(),
  },
}));

let logOptions: LoggerOptions;

describe("Logger", () => {
  beforeEach(() => {
    logOptions = {
      serviceName: "maccheroni-service",
      logLevel: LogLevel.Debug,
      isProduction: false,
    };
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it("should configure a serviceName and minimal log level as per LoggerOptions", async () => {
    const spyOnCreateLogger = jest.spyOn(winston, "createLogger");

    const logger = new Logger(logOptions);

    expect(logger.level).toEqual(logOptions.logLevel);
    expect(spyOnCreateLogger).toBeCalledTimes(1);
    expect(spyOnCreateLogger).toBeCalledWith(
      expect.objectContaining({
        defaultMeta: {
          component: logOptions.serviceName,
        },
      })
    );
  });

  it("creates a logger with the correct options", () => {
    new Logger(logOptions);

    expect(winston.createLogger).toHaveBeenCalledWith({
      defaultMeta: {
        component: logOptions.serviceName,
        ...logOptions.metadata,
      },
      level: logOptions.logLevel,
      format: expect.any(Array),
      transports: expect.any(Array),
      handleExceptions: true,
      exitOnError: true,
      exceptionHandlers: expect.any(Array),
      rejectionHandlers: expect.any(Array),
    });
  });

  describe("use the underline logger", () => {
    let spyOnCreateLogger;
    const mockLogger = {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    } as unknown as winston.Logger;

    beforeEach(() => {
      spyOnCreateLogger = jest
        .spyOn(winston, "createLogger")
        .mockReturnValue(mockLogger);
    });

    it("logs a debug message", () => {
      const logger = new Logger(logOptions);

      logger.debug("debug message");

      expect(mockLogger.debug).toHaveBeenCalledWith("debug message", undefined);
    });

    it("logs an info message", () => {
      const logger = new Logger(logOptions);

      logger.info("info message");

      expect(mockLogger.info).toHaveBeenCalledWith("info message", undefined);
    });

    it("logs a warn message", () => {
      const logger = new Logger(logOptions);

      logger.warn("warn message");

      expect(mockLogger.warn).toHaveBeenCalledWith("warn message", undefined);
    });

    it("logs an error message", () => {
      const logger = new Logger(logOptions);

      logger.error("error message");

      expect(mockLogger.error).toHaveBeenCalledWith(
        "error message",
        undefined,
        undefined
      );
    });
  });
});
