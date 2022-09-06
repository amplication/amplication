import { useQuery } from "@apollo/client";
import React, { useCallback } from "react";
import { Topic } from "../../models";
import { topicsOfBroker } from "./queries/topicsQueries";
import ServiceConnectionTopicItem from "./ServiceConnectionTopicItem";
import { FormValues } from "./ServiceConnectionTopicItemForm";

type Props = {
  messageBrokerId: string;
  enabled: boolean;
};
type TData = {
  Topics: Topic[];
};
export default function TopicsList({ messageBrokerId, enabled }: Props) {
  const { data } = useQuery<TData>(topicsOfBroker, {
    variables: { messageBrokerId },
    skip: !messageBrokerId,
  });

  const handlePatternChange = useCallback(({ patternType }: FormValues) => {
    console.log({ patternType });
  }, []);

  return data ? (
    <div>
      {JSON.stringify(enabled)}
      {data.Topics.map((topic, i) => (
        <ServiceConnectionTopicItem
          key={i}
          topic={topic}
          onPatterTypeChange={handlePatternChange}
        />
      ))}
    </div>
  ) : null;
}
