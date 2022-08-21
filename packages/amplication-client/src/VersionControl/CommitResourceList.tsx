import React from "react";
import CommitResourceListItem from "./CommitResourceListItem";
import * as models from "../models";
import DataPanel, { TitleDataType } from "./DataPanel";
import "./CommitResourceList.scss";

type Props = {
  builds: models.Maybe<models.Build[]> | undefined;
  commitId: string;
};

const CLASS_NAME = "commit-resource-list";
const CommitResourceList: React.FC<Props> = ({ builds, commitId }) => {
  const currentCommit = builds?.find((build) => build.commitId === commitId)
    ?.commit;

  return (
    <div className={CLASS_NAME}>
      <DataPanel
        id={commitId}
        dataType={TitleDataType.COMMIT}
        createdAt={currentCommit?.createdAt}
        account={currentCommit?.user?.account}
      />
      <div className={`${CLASS_NAME}__title`}>Builds</div>
      {builds &&
        builds.length &&
        builds.map((build: models.Build) => (
          <CommitResourceListItem key={build.id} build={build} />
        ))}
    </div>
  );
};

export default CommitResourceList;
