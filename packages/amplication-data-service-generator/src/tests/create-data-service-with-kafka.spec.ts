import { createDataService } from "../create-data-service";
import { appInfo, MODULE_EXTENSIONS_TO_SNAPSHOT } from "./appInfo";
import entities from "./entities";
import roles from "./roles";
import { EnumResourceType } from "../models";
import { DSGResourceData, Topic } from "@amplication/code-gen-types";
import { EnumMessagePatternConnectionOptions } from "@amplication/code-gen-types/dist/models";

jest.setTimeout(100000);

jest.mock("./create-log", () => ({
  createLog: jest.fn(),
}));

describe("createDataService", () => {
  test("creates resource as expected", async () => {
    const gitPullTopic: Topic = { id: "topicId", name: "git.pull" };
    const messageBroker: DSGResourceData = {
      resourceType: EnumResourceType.MessageBroker,
      entities: [],
      otherResources: [],
      roles: [],
      serviceTopics: [],
      topics: [gitPullTopic],
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
      entities,
      roles,
      resourceInfo: appInfo,
      resourceType: EnumResourceType.Service,
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
      pluginInstallations: [
        {
          id: "broker-kafka",
          npm: "@amplication/plugin-broker-kafka",
          enabled: true,
          pluginId: "broker-kafka",
          version: "latest",
        },
      ],
    };
    const modules = await createDataService(service);
    const modulesToSnapshot = modules.filter((module) =>
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
