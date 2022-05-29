import { CircleBadge, Icon } from "@amplication/design-system";
import React from "react";
import { App } from "../models";
import "./BuildSelectorItem.scss";

type Props = {
  title: string;
  app: App;
};
const CLASS_NAME = "build-selector-item";

export const BuildSelectorItem = ({ title, app }: Props) => {
  return (
    <div className={CLASS_NAME}>
      <Icon icon="git_merge" />
      <CircleBadge name={app.name} color={app.color} />
      <span>{title}</span>
    </div>
  );
};
