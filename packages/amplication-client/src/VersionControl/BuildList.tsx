import React, { useCallback, useState } from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { Snackbar } from "@rmwc/snackbar";
import "@rmwc/snackbar/styles";

import { CircularProgress } from "@rmwc/circular-progress";
import download from "downloadjs";

import { formatError } from "../util/error";
import * as models from "../models";
import { EnumButtonStyle, Button } from "../Components/Button";
import { PanelCollapsible } from "../Components/PanelCollapsible";
import UserAndTime from "../Components/UserAndTime";
import "./BuildList.scss";
import CircleIcon, { EnumCircleIconStyle } from "../Components/CircleIcon";

const CLASS_NAME = "build-list";

type TData = {
  builds: models.Build[];
};

type Props = {
  applicationId: string;
};

const BuildList = ({ applicationId }: Props) => {
  const [error, setError] = useState<Error>();
  const { data, loading, error: errorLoading } = useQuery<{
    builds: models.Build[];
  }>(GET_BUILDS, {
    variables: {
      appId: applicationId,
    },
  });

  const errorMessage =
    formatError(errorLoading) || (error && formatError(error));

  return (
    <div className={CLASS_NAME}>
      <h2>All Builds</h2>
      {loading && <CircularProgress />}
      {data?.builds.map((build, $index) => {
        return (
          <Build
            index={$index}
            key={build.id}
            build={build}
            onError={setError}
          />
        );
      })}
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </div>
  );
};

export default BuildList;

const Build = ({
  build,
  onError,
  index,
}: {
  build: models.Build;
  onError: (error: Error) => void;
  index: number;
}) => {
  const handleDownloadClick = useCallback(() => {
    downloadArchive(build.archiveURI).catch(onError);
  }, [build.archiveURI, onError]);

  let statusStyle: EnumCircleIconStyle;
  switch (build.status) {
    case (models.EnumBuildStatus.Completed, models.EnumBuildStatus.Active):
      statusStyle = EnumCircleIconStyle.Positive;
      break;

    case (models.EnumBuildStatus.Failed,
    models.EnumBuildStatus.Paused,
    models.EnumBuildStatus.Delayed):
      statusStyle = EnumCircleIconStyle.Negative;
      break;

    case models.EnumBuildStatus.Waiting:
      statusStyle = EnumCircleIconStyle.Warning;
      break;
    default:
      statusStyle = EnumCircleIconStyle.Warning;
      break;
  }

  return (
    <PanelCollapsible
      className={`${CLASS_NAME}__build`}
      open={index === 0}
      headerContent={
        <>
          <h3>Version {build.version}</h3>
          <UserAndTime
            firstName={build.createdBy?.account?.firstName}
            lastName={build.createdBy?.account?.lastName}
            time={build.createdAt}
          />
        </>
      }
    >
      <ul className="panel-list">
        <li>
          <div className={`${CLASS_NAME}__message`}>{build.message}</div>
          <div className={`${CLASS_NAME}__status`}>
            <CircleIcon icon="plus" style={statusStyle} />
            <span>{build.status}</span>
          </div>
        </li>
        <li className={`${CLASS_NAME}__actions`}>
          <Button
            buttonStyle={EnumButtonStyle.Clear}
            icon="download"
            disabled={build.status !== models.EnumBuildStatus.Completed}
            onClick={handleDownloadClick}
          >
            Download
          </Button>
        </li>
      </ul>
    </PanelCollapsible>
  );
};

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

const GET_BUILDS = gql`
  query builds($appId: String!) {
    builds(where: { app: { id: $appId } }, orderBy: { createdAt: Desc }) {
      id
      version
      message
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
