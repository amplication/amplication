import React, { useEffect, useCallback, useState, useMemo } from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { Snackbar } from "@rmwc/snackbar";
import "@rmwc/snackbar/styles";

import { CircularProgress } from "@rmwc/circular-progress";
import download from "downloadjs";
import { formatDistanceToNow } from "date-fns";
import UserAvatar from "../Components/UserAvatar";

import { formatError } from "../util/error";
import * as models from "../models";
import { EnumButtonStyle, Button } from "../Components/Button";
import {
  Panel,
  PanelHeader,
  EnumPanelStyle,
  PanelBody,
} from "../Components/Panel";

const CLASS_NAME = "build-list";
const POLL_INTERVAL = 2000;

type TData = {
  builds: models.Build[];
};

type Props = {
  applicationId: string;
};

const BuildList = ({ applicationId }: Props) => {
  const [error, setError] = useState<Error>();
  const {
    data,
    loading,
    error: errorLoading,
    refetch,
    stopPolling,
    startPolling,
  } = useQuery<{
    builds: models.Build[];
  }>(GET_BUILDS, {
    onCompleted: () => {
      //we use start polling every after refetch in order to keep polling with the updated parameters
      //https://github.com/apollographql/apollo-client/issues/3053
      startPolling(POLL_INTERVAL);
    },
    variables: {
      appId: applicationId,
    },
  });

  const errorMessage =
    formatError(errorLoading) || (error && formatError(error));

  //start polling with cleanup
  useEffect(() => {
    refetch(); //polling will start after the first fetch is completed
    return () => {
      stopPolling();
    };
  }, [refetch, stopPolling, startPolling]);

  return (
    <div className={CLASS_NAME}>
      <h2>Previous Builds</h2>
      {loading && <CircularProgress />}
      {data?.builds.map((build) => {
        return <Build key={build.id} build={build} onError={setError} />;
      })}
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </div>
  );
};

export default BuildList;

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

  const BuildAt = useMemo(() => {
    /**@todo: update the value even when the data was not changed to reflect the correct distance from now */
    return (
      build.createdAt &&
      formatDistanceToNow(new Date(build.createdAt), {
        addSuffix: true,
      })
    );
  }, [build.createdAt]);

  return (
    <Panel panelStyle={EnumPanelStyle.Collapsible}>
      <PanelHeader title={`Version ${build.version}`} />
      <PanelBody>
        <UserAvatar
          firstName={build.createdBy.account?.firstName}
          lastName={build.createdBy.account?.lastName}
        />
        {BuildAt}
        {build.version}
        <Button
          buttonStyle={EnumButtonStyle.Clear}
          icon="download"
          disabled={build.status !== models.EnumBuildStatus.Completed}
          onClick={handleDownloadClick}
        />
      </PanelBody>
    </Panel>
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
  query($appId: String!) {
    builds(where: { app: { id: $appId } }, orderBy: { version: Desc }) {
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
