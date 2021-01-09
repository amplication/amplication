import React from "react";
import { Snackbar } from "@rmwc/snackbar";
import { gql, useQuery } from "@apollo/client";
import { formatError } from "../util/error";
import * as models from "../models";
import { CircularProgress } from "@rmwc/circular-progress";

const CLASS_NAME = "github-repos";

type Props = {
  applicationId: string;
};

function GithubRepos({ applicationId }: Props) {
  const { data, error, loading } = useQuery<{
    appAvailableGithubRepos: models.GithubRepo[];
  }>(FIND_GITHUB_REPOS, {
    variables: {
      id: applicationId,
    },
  });

  const errorMessage = formatError(error);

  return (
    <div className={CLASS_NAME}>
      Select Repo
      {loading && <CircularProgress />}
      {data?.appAvailableGithubRepos.map((repo) => (
        <div key={repo.fullName}>{repo.fullName}</div>
      ))}
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </div>
  );
}

export default GithubRepos;

export const FIND_GITHUB_REPOS = gql`
  query appAvailableGithubRepos($id: String!) {
    appAvailableGithubRepos(where: { app: { id: $id } }) {
      name
      url
      private
      fullName
      admin
    }
  }
`;
