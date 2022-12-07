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
import { topicsOfBroker } from "./queries/topicsQueries";
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
  Topics: Topic[];
};
export default function TopicsList({
  messageBrokerId,
  enabled,
  messagePatterns,
}: Props) {
  const { trackEvent } = useTracking();
  const { data } = useQuery<TData>(topicsOfBroker, {
    fetchPolicy: "no-cache",
    variables: { messageBrokerId },
    skip: !messageBrokerId,
  });

  const messagePatternsByTopicId = useMemo(() => {
    if (!messagePatterns) return {};

    return keyBy(messagePatterns, (pattern) => pattern.topicId);
  }, [messagePatterns]);

  return data ? (
    data.Topics.length ? (
      <FieldArray
        validateOnChange
        name="patterns"
        render={({ replace }) => (
          <div className="topics-list">
            {data.Topics.map((topic, i) => (
              <ServiceTopicPanel
                enabled={enabled}
                key={i}
                topic={topic}
                selectedPatternType={
                  messagePatternsByTopicId[topic.id] || {
                    type: EnumMessagePatternConnectionOptions.None,
                    topicId: topic.id,
                  }
                }
                onMessagePatternTypeChange={(pattern) => {
                  trackEvent({
                    eventName: AnalyticsEventNames.MessagePatternTypeClick,
                    pattern,
                  });
                  replace(i, { type: pattern, topicId: topic.id });
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
