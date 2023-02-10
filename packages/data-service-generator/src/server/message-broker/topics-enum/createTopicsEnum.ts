import {
  CreateMessageBrokerParams,
  EventNames,
  Module,
} from "@amplication/code-gen-types";
import { pascalCase } from "pascal-case";
import { join } from "path";
import { types } from "recast";
import { print, EnumBuilder } from "@amplication/code-gen-utils";
import DsgContext from "../../../dsg-context";
import pluginWrapper from "../../../plugin-wrapper";

const { builders } = types;
const TOPIC_NAME = "topics.ts";

export function createTopicsEnum(
  eventParams: CreateMessageBrokerParams
): Promise<Module[]> {
  return pluginWrapper(
    createTopicsEnumInternal,
    EventNames.CreateMessageBrokerTopicsEnum,
    eventParams
  );
}

export async function createTopicsEnumInternal(
  eventParams: CreateMessageBrokerParams
): Promise<Module[]> {
  const context = DsgContext.getInstance;
  const { serviceTopics, otherResources, serverDirectories } = context;
  if (!serviceTopics.length) {
    return [];
  }

  const astFile = builders.file(builders.program([]));
  const topics = serviceTopics.map((serviceTopic) => {
    const messageBrokerName = otherResources?.find((resource) => {
      return resource.resourceInfo?.id === serviceTopic.messageBrokerId;
    })?.resourceInfo?.name;
    if (!messageBrokerName) {
      throw new Error("Message broker not found");
    }

    const astEnum = new EnumBuilder(pascalCase(messageBrokerName) + "Topics");
    serviceTopic.patterns.forEach((topic) => {
      if (!topic.topicName) {
        throw new Error(`Topic name not found for topic id ${topic.topicId}`);
      }
      astEnum.createMember(pascalCase(topic.topicName), topic.topicName);
    });
    return builders.exportDeclaration(false, astEnum.ast);
  });
  astFile.program.body.push(...topics);
  const path = join(serverDirectories.messageBrokerDirectory, TOPIC_NAME);
  return [{ code: print(astFile).code, path }];
}
