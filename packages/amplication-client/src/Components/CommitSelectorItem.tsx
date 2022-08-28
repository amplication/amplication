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
    </div>
  );
};
