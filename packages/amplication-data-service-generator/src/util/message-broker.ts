import {
  DSGResourceData,
  MessageBrokersDataForService,
  ServiceTopics,
} from "@amplication/code-gen-types";
import assert from "assert";
import { EnumResourceType } from "../models";

export function fromServiceTopicsToTopicsWithName(
  serviceTopics: ServiceTopics[],
  messageBrokers: DSGResourceData[]
): MessageBrokersDataForService {
  messageBrokers.forEach((resource) =>
    assert(resource.resourceType === EnumResourceType.MessageBroker)
  );

  const topicIdToNameMap = new Map<string, string>();
  messageBrokers.forEach((messageBroker) => {
    messageBroker.topics?.forEach((topic) => {
      if (topicIdToNameMap.get(topic.id)) {
        return;
      }
      topicIdToNameMap.set(topic.id, topic.name);
    });
  });

  const results = serviceTopics.map((serviceTopic) => {
    const messageBroker = messageBrokers.find(
      (messageBroker) =>
        serviceTopic.messageBrokerId === messageBroker.resourceInfo?.id
    );
    const messageBrokerName = messageBroker?.resourceInfo?.name;
    if (!messageBrokerName) {
      throw new Error(
        `Message broker not found for service topic ${serviceTopic.id}`
      );
    }
    const topicsWithNames = serviceTopic.patterns.map((pattern) => {
      const topicName = topicIdToNameMap.get(pattern.topicId);
      if (!topicName) {
        throw new Error(`Topic with id ${pattern.topicId} not found`);
      }
      return {
        name: topicName,
        type: pattern.type,
      };
    });

    return { messageBrokerName, topicsWithNames };
  });

  return results;
}
