import { formatTimeToNow } from "@amplication/design-system";
import React from "react";
import { Commit } from "../models";
import "./CommitSelectorItem.scss";

type Props = {
  commit: Commit | null;
};
const CLASS_NAME = "commit-selector-item";

export const CommitSelectorItem = ({ commit }: Props) => {
  const createdAtHour = commit
    ? formatTimeToNow(new Date(commit?.createdAt))
    : null;

  const createdHourStyle = () => (
    <label className={`commit-selector__hour`}>{createdAtHour}</label>
  );

  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__title`}>
        {commit?.message ? commit?.message : commit?.createdAt}
        <div>{createdHourStyle()}</div>
      </div>
    </div>
  );
};
