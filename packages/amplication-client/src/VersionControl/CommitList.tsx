import React, { useContext } from "react";
import { ApolloError } from "@apollo/client";
import { formatError } from "../util/error";
import * as models from "../models";
import { Snackbar, CircularProgress } from "@amplication/design-system";
import { AppContext } from "../context/appContext";
import { CommitListItem } from "./CommitListItem";

import "./CommitList.scss";

type Props = {
  commits: models.Commit[];
  error: ApolloError | undefined;
  loading: boolean;
};

const CLASS_NAME = "commit-list";

const CommitList = ({ commits, error, loading }: Props) => {
  const { currentProject } = useContext(AppContext);

  const errorMessage = formatError(error);

  return (
    <div className={CLASS_NAME}>
      {loading && <CircularProgress centerToParent />}

      {currentProject &&
        commits.map((commit) => (
          <CommitListItem
            key={commit.id}
            commit={commit}
            projectId={currentProject.id}
          />
        ))}
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </div>
  );
};

export default CommitList;
