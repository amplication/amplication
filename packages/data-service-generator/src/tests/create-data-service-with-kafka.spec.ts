import {
  DSGResourceData,
  EnumMessagePatternConnectionOptions,
  Topic,
} from "@amplication/code-gen-types";
import { MockedLogger } from "@amplication/util/logging/test-utils";
import { createDataService } from "../create-data-service";
import { EnumResourceType } from "../models";
import { TEST_DATA } from "./test-data";
import { MODULE_EXTENSIONS_TO_SNAPSHOT } from "./appInfo";
import { rm } from "fs/promises";
import { getTemporaryPluginInstallationPath } from "./dynamic-plugin-installation-path";
import { plugins } from "./mock-data-plugin-installations";

jest.setTimeout(100000);

const temporaryPluginInstallationPath =
  getTemporaryPluginInstallationPath(__filename);

describe("createDataService", () => {
  afterEach(async () => {
    jest.clearAllMocks();
    await rm(temporaryPluginInstallationPath, {
      recursive: true,
      force: true,
    });
  });
  describe("when kafka plugin is installed", () => {
    test("creates resource as expected", async () => {
      const gitPullTopic: Topic = { id: "topicId", name: "git.pull" };
      const messageBroker: DSGResourceData = {
        resourceType: EnumResourceType.MessageBroker,
        entities: [],
        otherResources: [],
        roles: [],
        serviceTopics: [],
        topics: [gitPullTopic],
        buildId: "example_build_id",
        resourceInfo: {
          id: "messageBrokerId",
          description: "This is the message broker description",
          name: "Kafka broker",
          url: "",
          //@ts-ignore
          settings: {},
          version: "1.0.0",
        },
        pluginInstallations: [],
      };
      const service: DSGResourceData = {
        ...TEST_DATA,
        serviceTopics: [
          {
            enabled: true,
            id: "serviceTopicId",
            messageBrokerId: messageBroker.resourceInfo!.id,
            patterns: [
              {
                topicId: gitPullTopic.id,
                type: EnumMessagePatternConnectionOptions.Receive,
              },
            ],
          },
        ],
        otherResources: [messageBroker],
        pluginInstallations: [plugins.kafka],
      };
      const modules = await createDataService(
        service,
        MockedLogger,
        temporaryPluginInstallationPath
      );
      const modulesToSnapshot = modules
        .modules()
        .filter((module) =>
          MODULE_EXTENSIONS_TO_SNAPSHOT.some((extension) =>
            module.path.endsWith(extension)
          )
        );
      const pathToCode = Object.fromEntries(
        modulesToSnapshot.map((module) => [module.path, module.code])
      );
      expect(pathToCode).toMatchSnapshot();
    });
  });
});
