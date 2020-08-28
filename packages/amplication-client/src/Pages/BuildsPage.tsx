import React, { useCallback } from "react";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { match } from "react-router-dom";
import { Button, EnumButtonStyle } from "../Components/Button";
import * as models from "../models";

type Props = {
  match: match<{ application: string }>;
};

const BuildsPage = ({ match }: Props) => {
  const { application } = match.params;
  const { data, loading } = useQuery<{ builds: models.Build[] }>(GET_BUILDS, {
    variables: { appId: application },
  });
  /** @todo update cache */
  const [createBuild] = useMutation<{ createBuild: models.Build }>(
    CREATE_BUILD,
    {
      variables: { appId: application },
    }
  );
  const handleBuildButtonClick = useCallback(() => {
    createBuild();
  }, [createBuild]);
  return (
    <div>
      <h1>Build</h1>
      <Button onClick={handleBuildButtonClick}>Build</Button>
      {loading && "Loading builds..."}
      {data &&
        data.builds.map((build) => {
          return <Build key={build.id} build={build} />;
        })}
    </div>
  );
};

export default BuildsPage;

const Build = ({ build }: { build: models.Build }) => {
  return (
    <div>
      {build.status} {new Date(build.createdAt).toLocaleString()}{" "}
      {build.createdBy.account?.firstName} {build.createdBy.account?.lastName}
      <a href={build.archiveURL}>
        <Button
          buttonStyle={EnumButtonStyle.Secondary}
          disabled={build.status !== models.EnumBuildStatus.Completed}
        >
          Download
        </Button>
      </a>
    </div>
  );
};

const GET_BUILDS = gql`
  query($appId: String!) {
    builds(where: { app: { id: $appId } }, orderBy: { createdAt: Desc }) {
      id
      createdAt
      createdBy {
        id
        account {
          firstName
          lastName
        }
      }
      status
      archiveURL
    }
  }
`;

const CREATE_BUILD = gql`
  mutation($appId: String!) {
    createBuild(data: { app: { connect: { id: $appId } } }) {
      id
      createdAt
      createdBy {
        id
      }
      status
    }
  }
`;
