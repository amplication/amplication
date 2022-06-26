import { CircleBadge } from "@amplication/design-system";
import React from "react";
import { App } from "../models";
import "./BuildSelectorItem.scss";

type Props = {
  title: string;
  app: App;
  type?: "list";
};
const CLASS_NAME = "build-selector-item";

export const BuildSelectorItem = ({ title, app, type }: Props) => {
  return (
    <div className={CLASS_NAME}>
      <CircleBadge name={app.name} color={app.color} />
      <div className={`title ${type && " title-list"}`}>{title}</div>
    </div>
  );
};
