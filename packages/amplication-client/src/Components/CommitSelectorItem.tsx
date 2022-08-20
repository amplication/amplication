import React from "react";
import "./CommitSelectorItem.scss";

type Props = {
  title: string;
  type?: "list";
};
const CLASS_NAME = "commit-selector-item";

export const CommitSelectorItem = ({ title, type }: Props) => {
  return (
    <div className={CLASS_NAME}>
      <div className={`title ${type && " title-list"}`}>{title}</div>
    </div>
  );
};
