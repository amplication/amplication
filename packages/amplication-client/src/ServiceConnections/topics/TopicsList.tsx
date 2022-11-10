import { useQuery } from "@apollo/client";
import { FieldArray } from "formik";
import React from "react";
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
    variables: { messageBrokerId },
    skip: !messageBrokerId,
  });

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
                  messagePatterns[i] || {
                    type: EnumMessagePatternConnectionOptions.None,
                    topicId: topic.id,
                  }
                }
                onMessagePatternTypeChange={(pattern) => {
                  trackEvent({
                    eventName: `messagePatternTypeClick-${pattern}`,
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
        message="This message broker has no topics"
        image={EnumImages.CommitEmptyState}
      />
    )
  ) : null;
}
