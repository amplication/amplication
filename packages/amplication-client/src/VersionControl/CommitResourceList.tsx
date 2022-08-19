import React from "react";
import CommitResourceListItem from "./CommitResourceListItem";
import * as models from "../models";

type Props = {
  builds: models.Maybe<models.Build[]> | undefined;
  changes: models.Maybe<models.PendingChange[]> | undefined;
};

const CommitResourceList: React.FC<Props> = ({ builds, changes }) => {
  return (
    <div>
      {builds &&
        builds.length &&
        builds.map((build: models.Build) => (
          <CommitResourceListItem key={build.id} build={build} changes={changes} />
        ))}
    </div>
  );
};

export default CommitResourceList;
