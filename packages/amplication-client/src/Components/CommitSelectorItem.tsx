import React from "react";
import { Commit } from "../models";
import "./CommitSelectorItem.scss";
import UserBadge from "./UserBadge";

type Props = {
  commit: Commit | null;
};
const CLASS_NAME = "commit-selector-item";

export const CommitSelectorItem = ({ commit }: Props) => {
  return (
    <div className={CLASS_NAME}>
      <UserBadge />
      <div className={`${CLASS_NAME}__title`}>
        {commit?.message || "No commit message"}
      </div>
    </div>
  );
};
