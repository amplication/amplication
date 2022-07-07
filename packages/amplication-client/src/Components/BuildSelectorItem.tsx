import { CircleBadge } from "@amplication/design-system";
import React from "react";
import { Resource } from "../models";
import "./BuildSelectorItem.scss";

type Props = {
  title: string;
  resource: Resource;
  type?: "list";
};
const CLASS_NAME = "build-selector-item";

export const BuildSelectorItem = ({ title, resource, type }: Props) => {
  return (
    <div className={CLASS_NAME}>
      <CircleBadge name={resource.name} color={resource.color} />
      <div className={`title ${type && " title-list"}`}>{title}</div>
    </div>
  );
};
