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

const CommitList = ({ commits, error, loading }: Props) => {
  const { currentProject } = useContext(AppContext);
 

  const errorMessage = formatError(error);

  return (
    <>
      {loading && <CircularProgress />}
      {currentProject &&
        commits.map((commit) => (
          <CommitListItem
            key={commit.id}
            commit={commit}
            projectId={currentProject.id}
          />
        ))}
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </>
  );
};

export default CommitList;
