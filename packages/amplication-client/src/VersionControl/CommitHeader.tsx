import React from "react";
import * as models from "../models";

import { UserAndTime } from "@amplication/design-system";
import { ClickableId } from "../Components/ClickableId";
import { TruncatedId } from "../Components/TruncatedId";

import "./CommitHeader.scss";

const CLASS_NAME = "commit-header";

type Props = {
  commit: models.Commit;
  applicationId: string;
  clickableId?: boolean;
};
const CommitHeader = ({ applicationId, commit, clickableId }: Props) => {
  const account = commit.user?.account;

  return (
    <div className={`${CLASS_NAME}`}>
      <h1>
        Commit{" "}
        {clickableId ? (
          <ClickableId
            to={`/${applicationId}/commits/${commit.id}`}
            id={commit.id}
            eventData={{
              eventName: "commitHeaderIdClick",
            }}
          />
        ) : (
          <TruncatedId id={commit.id} />
        )}
      </h1>
      <div className={`${CLASS_NAME}__sub-header`}>
        <UserAndTime account={account} time={commit.createdAt} />
        <span className={`${CLASS_NAME}__message`}>{commit.message}</span>
      </div>
    </div>
  );
};

export default CommitHeader;
