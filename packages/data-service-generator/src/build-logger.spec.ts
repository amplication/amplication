import { logger as applicationLogger } from "./logging";
import { httpClient } from "./utils/http-client";
import { LogLevel } from "@amplication/util/logging";
import { BuildLogger } from "./build-logger";
jest.mock("./logging");
jest.mock("./utils/http-client");

describe("BuildLogger", () => {
  let buildLogger: BuildLogger;
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = {
      ...OLD_ENV,
      REMOTE_ENV: "true",
      BUILD_MANAGER_URL: "http://localhost",
    };
    const mockedHttpClient = httpClient as jest.Mocked<typeof httpClient>;
    mockedHttpClient.post.mockResolvedValue("OK");

    buildLogger = new BuildLogger();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  afterAll(() => {
    process.env = OLD_ENV; // Restore old environment
  });

  describe("info", () => {
    it("should log info and create log entry", async () => {
      const message = "Test info message";
      const params = { param1: "test", param2: 1 };
      const userFriendlyMessage = "User friendly message";

      await buildLogger.info(message, params, userFriendlyMessage);

      expect(applicationLogger.info).toHaveBeenCalledWith(message, params);
      expect(httpClient.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          level: LogLevel.Info,
          message: userFriendlyMessage,
        })
      );
    });
  });

  describe("warn", () => {
    it("should log warn and create log entry", async () => {
      const message = "Test warn message";
      const params = { param1: "test", param2: 1 };
      const userFriendlyMessage = "User friendly message";

      await buildLogger.warn(message, params, userFriendlyMessage);

      expect(applicationLogger.warn).toHaveBeenCalledWith(message, params);
      expect(httpClient.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          level: LogLevel.Warn,
          message: userFriendlyMessage,
        })
      );
    });
  });

  describe("error", () => {
    it("should log error and create log entry", async () => {
      const message = "Test error message";
      const params = { param1: "test", param2: 1 };
      const userFriendlyMessage = "User friendly message";
      const error = new Error("Test error");

      await buildLogger.error(message, params, userFriendlyMessage, error);

      expect(applicationLogger.error).toHaveBeenCalledWith(
        message,
        error,
        params
      );
      expect(httpClient.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          level: LogLevel.Error,
          message: userFriendlyMessage,
        })
      );
    });
  });
});
