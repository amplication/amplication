import { HorizontalRule, Panel } from "@amplication/design-system";
import React, { useMemo } from "react";
import {
  EnumMessagePatternConnectionOptions,
  MessagePattern,
  Topic,
} from "../../models";
import "./ServiceTopicPanel.scss";
import ServiceTopicPatternMenu from "./ServiceTopicPatternMenu";

const CLASS_NAME = "service-topic-panel";

type Props = {
  topic: Topic;
  enabled: boolean;
  selectedPatternType: MessagePattern;
  onMessagePatternTypeChange: (
    pattern: EnumMessagePatternConnectionOptions
  ) => void;
};

export default function ServiceTopicPanel({
  topic,
  enabled,
  selectedPatternType,
  onMessagePatternTypeChange,
}: Props) {
  return (
    <Panel>
      <div className={`${CLASS_NAME}__header`}>
        <span className={`${CLASS_NAME}__header__title`}>
          {topic.displayName}
        </span>
        <StatusText patternType={selectedPatternType.type} />
      </div>
      <div className={`${CLASS_NAME}__description`}>{topic.description}</div>

      <HorizontalRule />
      <ServiceTopicPatternMenu
        onMessagePatternTypeChange={onMessagePatternTypeChange}
        selectedPatternType={selectedPatternType.type}
      />
    </Panel>
  );
}

type StatusTextProps = {
  patternType: EnumMessagePatternConnectionOptions;
};
const StatusText = ({ patternType }: StatusTextProps) => {
  const color = useMemo(() => {
    return patternType === EnumMessagePatternConnectionOptions.None
      ? "var(--negative-light)"
      : "var(--positive-default)";
  }, [patternType]);
  return <span style={{ color }}>{patternType}</span>;
};
