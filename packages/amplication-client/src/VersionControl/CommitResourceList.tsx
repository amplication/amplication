import React from "react";
import { Build } from "../models";
import CommitResourceListItem from "./CommitResourceListItem";
import * as models from "../models";

type Props = {
  builds: models.Maybe<models.Build[]> | undefined;
};

const CommitResourceList: React.FC<Props> = ({ builds }) => {
  return (
    <div>
      {builds && builds.map((build: Build) => (
        <CommitResourceListItem key={build.id} build={build} />
      ))}
    </div>
  );
};

export default CommitResourceList;
