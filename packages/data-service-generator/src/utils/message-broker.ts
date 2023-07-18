import { DSGResourceData, ServiceTopics } from "@amplication/code-gen-types";
import { EnumResourceType } from "../models";

export function resolveTopicNames(
  serviceTopicsList: ServiceTopics[],
  messageBrokers: DSGResourceData[]
): ServiceTopics[] {
  messageBrokers.forEach((resource) => {
    if (resource.resourceType !== EnumResourceType.MessageBroker) {
      throw new Error("resourceType is not EnumResourceType.MessageBroker");
    }
  });

  const topicIdToNameMap = new Map<string, string>();
  messageBrokers.forEach((messageBroker) => {
    messageBroker.topics?.forEach((topic) => {
      if (topicIdToNameMap.get(topic.id)) {
        return;
      }
      topicIdToNameMap.set(topic.id, topic.name);
    });
  });

  const updatedServiceTopicsList = serviceTopicsList.map((serviceTopic) => {
    serviceTopic.patterns = serviceTopic.patterns.map((pattern) => {
      const topicName = topicIdToNameMap.get(pattern.topicId);
      if (!topicName) {
        throw new Error(`Topic with id ${pattern.topicId} not found`);
      }
      pattern.topicName = topicName;
      return pattern;
    });
    return serviceTopic;
  });

  return updatedServiceTopicsList;
}
