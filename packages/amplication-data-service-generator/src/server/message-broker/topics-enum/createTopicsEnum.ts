import {
  MessageBrokersDataForService,
  Module,
} from "@amplication/code-gen-types";
import { dotCase } from "dot-case";
import { pascalCase } from "pascal-case";
import { join } from "path";
import { print, types } from "recast";
import { EnumBuilder } from "../../../util/enum-builder";

const { builders } = types;

export async function createTopicsEnum(
  kafkaFolder: string,
  serviceTopicsWithName: MessageBrokersDataForService
): Promise<Module | undefined> {
  if (!serviceTopicsWithName.length) {
    return undefined;
  }
  const astFile = builders.file(builders.program([]));
  const topics = serviceTopicsWithName.map((serviceTopic) => {
    const astEnum = new EnumBuilder(
      pascalCase(serviceTopic.messageBrokerName) + "Topics"
    );
    serviceTopic.topicsWithNames.forEach((topic) => {
      astEnum.createMember(pascalCase(topic.name), dotCase(topic.name));
    });
    return astEnum.ast;
  });
  astFile.program.body.push(...topics);

  const path = join(kafkaFolder, "topics.ts");
  return { code: print(astFile).code, path };
}
