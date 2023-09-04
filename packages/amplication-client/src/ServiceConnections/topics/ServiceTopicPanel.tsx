import { HorizontalRule, Panel } from "@amplication/ui/design-system";
import classNames from "classnames";
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
    <Panel className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__header`}>
        <span
          className={classNames([
            `${CLASS_NAME}__header__title`,
            ...[!enabled && `${CLASS_NAME}-disable`],
          ])}
        >
          {topic.displayName}
        </span>
        <StatusText patternType={selectedPatternType.type} enable={enabled} />
      </div>
      <div className={`${CLASS_NAME}__description`}>{topic.description}</div>

      <HorizontalRule />

      {enabled && (
        <ServiceTopicPatternMenu
          onMessagePatternTypeChange={onMessagePatternTypeChange}
          selectedPatternType={selectedPatternType.type}
        />
      )}
    </Panel>
  );
}

type StatusTextProps = {
  patternType: EnumMessagePatternConnectionOptions;
  enable: boolean;
};
const StatusText = ({ patternType, enable }: StatusTextProps) => {
  const color = useMemo(() => {
    if (!enable) {
      return "var(--black40)";
    }
    return patternType === EnumMessagePatternConnectionOptions.None
      ? "var(--negative-light)"
      : "var(--positive-default)";
  }, [enable, patternType]);
  return <span style={{ color }}>{patternType}</span>;
};
