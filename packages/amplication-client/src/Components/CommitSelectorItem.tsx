import React from "react";
import "./CommitSelectorItem.scss";

type Props = {
  title: string;
};
const CLASS_NAME = "commit-selector-item";

export const CommitSelectorItem = ({ title }: Props) => {
  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__title`}>{title}</div>
    </div>
  );
};
