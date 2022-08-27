import { formatTimeToNow } from "@amplication/design-system";
import React, { useMemo } from "react";
import { Commit } from "../models";
import { truncateWithEllipsis } from "../util/truncatedWithEllipsis";
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

  const truncateCommitMessage = useMemo(() => {
    return truncateWithEllipsis(
      commit?.message.trim(),
      15,
      "No commit message"
    );
  }, [commit?.message]);

  return (
    <div className={CLASS_NAME}>
      <UserBadge />
      <div className={`${CLASS_NAME}__title`}>{truncateCommitMessage}</div>
      <div className={`${CLASS_NAME}__createdAt`}>{createdHourStyle()}</div>
    </div>
  );
};
