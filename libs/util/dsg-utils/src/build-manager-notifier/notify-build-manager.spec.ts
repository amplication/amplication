import { logger as applicationLogger } from "../logger/logging";
import { httpClient } from "../http-client/http-client";
import { LogLevel } from "@amplication/util/logging";
import {
  BuildManagerNotifier,
  NotifyPluginVersionDto,
} from "./notify-build-manager";
jest.mock("../http-client/http-client");

const mockedHttpClient = httpClient as jest.Mocked<typeof httpClient>;
mockedHttpClient.post.mockResolvedValue("OK");

const EXAMPLE_BUILD_ID = "exampleBuildId";
const EXAMPLE_RESOURCE_ID = "exampleResourceId";

describe("BuildManagerNotifier", () => {
  let buildManagerNotifier: BuildManagerNotifier;
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = {
      ...OLD_ENV,
      REMOTE_ENV: "true",
      BUILD_MANAGER_URL: "http://localhost",
    };

    buildManagerNotifier = new BuildManagerNotifier({
      buildManagerUrl: "http://localhost",
      resourceId: EXAMPLE_RESOURCE_ID,
      buildId: EXAMPLE_BUILD_ID,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  afterAll(() => {
    process.env = OLD_ENV; // Restore old environment
  });

  describe("success", () => {
    it("should notify the success event", async () => {
      await buildManagerNotifier.success();

      expect(httpClient.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          resourceId: EXAMPLE_RESOURCE_ID,
          buildId: EXAMPLE_BUILD_ID,
        })
      );
    });
  });

  describe("failure", () => {
    it("should notify the failure event", async () => {
      await buildManagerNotifier.failure();

      expect(httpClient.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          resourceId: EXAMPLE_RESOURCE_ID,
          buildId: EXAMPLE_BUILD_ID,
        })
      );
    });
  });

  describe("notifyPluginVersion", () => {
    it("should notify the plugin version event", async () => {
      const args: NotifyPluginVersionDto = {
        packageVersion: "1.0.0",
        requestedFullPackageName: "requestedFullPackageName",
        packageName: "packageName",
      };

      await buildManagerNotifier.notifyPluginVersion(args);

      expect(httpClient.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          ...args,
          buildId: EXAMPLE_BUILD_ID,
        })
      );
    });
  });
});
