import { useQuery } from "@apollo/client";
import { FieldArray } from "formik";
import { keyBy } from "lodash";
import React, { useMemo } from "react";
import { EmptyState } from "../../Components/EmptyState";
import { EnumImages } from "../../Components/SvgThemeImage";
import {
  EnumMessagePatternConnectionOptions,
  MessagePattern,
  Topic,
} from "../../models";
import { GET_TOPICS_OF_BROKER } from "./queries/topicsQueries";
import ServiceTopicPanel from "./ServiceTopicPanel";
import { useTracking } from "../../util/analytics";
import "./TopicsList.scss";
import { AnalyticsEventNames } from "../../util/analytics-events.types";

type Props = {
  messageBrokerId: string;
  enabled: boolean;
  messagePatterns: MessagePattern[];
};
type TData = {
  topics: Topic[];
};
type messagePatternDictionary = {
  [topicId: string]: EnumMessagePatternConnectionOptions;
};
export default function TopicsList({
  messageBrokerId,
  enabled,
  messagePatterns,
}: Props) {
  const { trackEvent } = useTracking();
  const { data } = useQuery<TData>(GET_TOPICS_OF_BROKER, {
    fetchPolicy: "no-cache",
    variables: { messageBrokerId },
    skip: !messageBrokerId,
  });

  const messagePatternsByTopicId = useMemo(() => {
    if (!messagePatterns) return {};

    return keyBy(messagePatterns, (pattern) => pattern.topicId);
  }, [messagePatterns]);

  const messagePatternsByTopicIdDictionary: messagePatternDictionary = {};
  if (messagePatterns) {
    messagePatterns.forEach(
      (x) => (messagePatternsByTopicIdDictionary[x.topicId] = x.type)
    );
  }
  function handleSelectedPatternType(currentTopicId): MessagePattern {
    return {
      type:
        messagePatternsByTopicIdDictionary[currentTopicId] ||
        EnumMessagePatternConnectionOptions.None,
      topicId: currentTopicId,
    } as MessagePattern;
  }

  return data ? (
    data.topics.length ? (
      <FieldArray
        validateOnChange
        name="patterns"
        render={({ replace }) => (
          <div className="topics-list">
            {data.topics.map((topic, i) => (
              <ServiceTopicPanel
                enabled={enabled}
                key={i}
                topic={topic}
                selectedPatternType={handleSelectedPatternType(topic.id)}
                onMessagePatternTypeChange={(pattern) => {
                  trackEvent({
                    eventName: AnalyticsEventNames.MessagePatternTypeClick,
                    pattern,
                  });
                  replace(i, { topicId: topic.id, type: pattern });
                  messagePatternsByTopicIdDictionary[topic.id] = pattern;
                }}
              />
            ))}
          </div>
        )}
      />
    ) : (
      <EmptyState
        message="There are no connected message brokers to show"
        image={EnumImages.MessageBrokerEmptyState}
      />
    )
  ) : null;
}
