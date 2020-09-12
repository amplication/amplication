import React, { useCallback, useState, useMemo } from "react";
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
