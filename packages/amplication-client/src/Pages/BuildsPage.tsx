import React, { useCallback, useState } from "react";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { match } from "react-router-dom";
import download from "downloadjs";
import { Snackbar } from "@rmwc/snackbar";
import "@rmwc/snackbar/styles";
import { Button, EnumButtonStyle } from "../Components/Button";
import * as models from "../models";
import { formatError } from "../util/error";

type Props = {
  match: match<{ application: string }>;
};

const BuildsPage = ({ match }: Props) => {
  const { application } = match.params;
  const [error, setError] = useState<Error>();
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
  const errorMessage = error && formatError(error);
  return (
    <div>
      <h1>Build</h1>
      <Button onClick={handleBuildButtonClick}>Build</Button>
      {loading && "Loading builds..."}
      {data &&
        data.builds.map((build) => {
          return <Build key={build.id} build={build} onError={setError} />;
        })}
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </div>
  );
};

export default BuildsPage;

const Build = ({
  build,
  onError,
}: {
  build: models.Build;
  onError: (error: Error) => void;
}) => {
  const handleDownloadClick = useCallback(() => {
    downloadArchive(build.archiveURI).catch(onError);
  }, [build.archiveURI, onError]);
  return (
    <div>
      {build.status} {new Date(build.createdAt).toLocaleString()}{" "}
      {build.createdBy.account?.firstName} {build.createdBy.account?.lastName}
      <Button
        buttonStyle={EnumButtonStyle.Secondary}
        disabled={build.status !== models.EnumBuildStatus.Completed}
        onClick={handleDownloadClick}
      >
        Download
      </Button>
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
      archiveURI
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

async function downloadArchive(uri: string): Promise<void> {
  const res = await fetch(uri);
  const url = new URL(res.url);
  switch (res.status) {
    case 200: {
      const blob = await res.blob();
      download(blob, url.pathname);
      break;
    }
    case 404: {
      throw new Error("File not found");
    }
    default: {
      throw new Error(await res.text());
    }
  }
}
