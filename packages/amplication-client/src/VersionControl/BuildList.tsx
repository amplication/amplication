import React, { useCallback, useState } from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { Snackbar } from "@rmwc/snackbar";
import "@rmwc/snackbar/styles";
import { CircularProgress } from "@rmwc/circular-progress";
import download from "downloadjs";
import { isEmpty } from "lodash";
import { formatError } from "../util/error";
import * as models from "../models";
import { EnumButtonStyle, Button } from "../Components/Button";
import { PanelCollapsible } from "../Components/PanelCollapsible";
import UserAndTime from "../Components/UserAndTime";
import "./BuildList.scss";
import CircleIcon, { EnumCircleIconStyle } from "../Components/CircleIcon";
import { Link } from "react-router-dom";

const CLASS_NAME = "build-list";

const BUILD_STATUS_TO_STYLE: {
  [key in models.EnumBuildStatus]: EnumCircleIconStyle;
} = {
  [models.EnumBuildStatus.Active]: EnumCircleIconStyle.Positive,
  [models.EnumBuildStatus.Completed]: EnumCircleIconStyle.Positive,
  [models.EnumBuildStatus.Failed]: EnumCircleIconStyle.Negative,
  [models.EnumBuildStatus.Paused]: EnumCircleIconStyle.Negative,
  [models.EnumBuildStatus.Delayed]: EnumCircleIconStyle.Negative,
  [models.EnumBuildStatus.Waiting]: EnumCircleIconStyle.Warning,
};

type TData = {
  builds: models.Build[];
};

type Props = {
  applicationId: string;
};

const OPEN_ITEMS = 1;

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
      {!isEmpty(data?.builds) && <h2>All Builds</h2>}
      {loading && <CircularProgress />}
      {data?.builds.map((build, index) => {
        return (
          <Build
            open={index < OPEN_ITEMS}
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
  open,
}: {
  build: models.Build;
  onError: (error: Error) => void;
  open: boolean;
}) => {
  const handleDownloadClick = useCallback(() => {
    downloadArchive(build.archiveURI).catch(onError);
  }, [build.archiveURI, onError]);

  const account = build.createdBy?.account;
  return (
    <PanelCollapsible
      className={`${CLASS_NAME}__build`}
      initiallyOpen={open}
      headerContent={
        <>
          <h3>
            Version<span>{build.version}</span>
          </h3>
          <UserAndTime account={account} time={build.createdAt} />
        </>
      }
    >
      <ul className="panel-list">
        <li>
          <div className={`${CLASS_NAME}__message`}>{build.message}</div>
          <div className={`${CLASS_NAME}__status`}>
            <CircleIcon
              icon="plus"
              style={BUILD_STATUS_TO_STYLE[build.status]}
            />
            <span>{build.status}</span>
          </div>
        </li>
        <li className={`${CLASS_NAME}__actions`}>
          <Link to={`/${build.appId}/builds/${build.id}`}>
            <Button buttonStyle={EnumButtonStyle.Clear} icon="option_set">
              View Log
            </Button>
          </Link>
          <Button
            buttonStyle={EnumButtonStyle.Primary}
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

export const GET_BUILDS = gql`
  query builds($appId: String!) {
    builds(where: { app: { id: $appId } }, orderBy: { createdAt: Desc }) {
      id
      appId
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
