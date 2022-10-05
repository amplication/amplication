import React from "react";
import UserBadge from "../Components/UserBadge";
import { Commit } from "../models";
import "./CommitData.scss";

type Props = {
  commit: Commit;
};
const CLASS_NAME = "commit-data";
const CommitData: React.FC<Props> = ({ commit }) => {
  return (
    <div className={CLASS_NAME}>
      <UserBadge />
      <div className={`${CLASS_NAME}__metadata`}>
        <span className={`${CLASS_NAME}__metadata__message`}>
          {commit.message || "No commit message"}
        </span>
        <span className={`${CLASS_NAME}__metadata__created`}>
          {new Date(commit.createdAt).toDateString()}
        </span>
      </div>
    </div>
  );
};

export default CommitData;
