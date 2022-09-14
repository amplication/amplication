import {
  CreateMessageBrokerParams,
  EventNames,
  Module,
} from "@amplication/code-gen-types";
import { dotCase } from "dot-case";
import { pascalCase } from "pascal-case";
import { join } from "path";
import { print, types } from "recast";
import DsgContext from "../../../dsg-context";
import pluginWrapper from "../../../plugin-wrapper";
import { EnumBuilder } from "../../../util/enum-builder";

const { builders } = types;

export function createTopicsEnum(
  eventParams: CreateMessageBrokerParams["before"]
) {
  return pluginWrapper(
    createTopicsEnumInternal,
    EventNames.CreateMessageBrokerTopicsEnum,
    eventParams
  );
}

export async function createTopicsEnumInternal(
  eventParams: CreateMessageBrokerParams["before"]
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
      astEnum.createMember(
        pascalCase(topic.topicName),
        dotCase(topic.topicName)
      );
    });
    return astEnum.ast;
  });
  astFile.program.body.push(...topics);

  const path = join(serverDirectories.messageBrokerDirectory, "topics.ts"); //TODO get the folder form context
  return [{ code: print(astFile).code, path }];
}
