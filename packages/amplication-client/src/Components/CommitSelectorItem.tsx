import { formatTimeToNow } from "@amplication/design-system";
import React from "react";
import { Commit } from "../models";
import "./CommitSelectorItem.scss";
import UserBadge from "./UserBadge";

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

  const truncateCommitMessage = (input: string) =>
    input.length && input.length < 15 ? input : `${input.substring(0, 15)}...`;

  return (
    <div className={CLASS_NAME}>
      <UserBadge />
      <div className={`${CLASS_NAME}__title`}>
        {truncateCommitMessage(commit?.message.trim() || "No commit message")}
      </div>
      <div className={`${CLASS_NAME}__createdAt`}>{createdHourStyle()}</div>
    </div>
  );
};
