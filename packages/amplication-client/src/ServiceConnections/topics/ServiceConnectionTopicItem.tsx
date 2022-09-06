import React from "react";
import {
  EnumMessagePatternConnectionOptions,
  MessagePattern,
  Topic,
} from "../../models";
import ServiceConnectionTopicItemForm from "./ServiceConnectionTopicItemForm";

type Props = {
  topic: Topic;
  enabled: boolean;
  selectedPatternType: MessagePattern;
  onMessagePatternTypeChange: (
    pattern: EnumMessagePatternConnectionOptions
  ) => void;
};
export default function ServiceConnectionTopicItem({
  topic,
  enabled,
  selectedPatternType,
  onMessagePatternTypeChange,
}: Props) {
  return (
    <div>
      {topic.displayName}
      <br />
      {topic.description}
      <ServiceConnectionTopicItemForm
        selectedPatternType={selectedPatternType}
        onMessagePatternTypeChange={onMessagePatternTypeChange}
      />
    </div>
  );
}
