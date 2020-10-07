import React, { useState, useEffect } from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { Snackbar } from "@rmwc/snackbar";
import "@rmwc/snackbar/styles";
import { CircularProgress } from "@rmwc/circular-progress";
import { isEmpty } from "lodash";
import { formatError } from "../util/error";
import * as models from "../models";
import "./BuildList.scss";
import Build from "./Build";

const CLASS_NAME = "build-list";

type TData = {
  builds: models.Build[];
};

type Props = {
  applicationId: string;
};

const OPEN_ITEMS = 1;
const POLL_INTERVAL = 2000;

const BuildList = ({ applicationId }: Props) => {
  const [error, setError] = useState<Error>();
  const {
    data,
    loading,
    error: errorLoading,
    startPolling,
    stopPolling,
  } = useQuery<{
    builds: models.Build[];
  }>(GET_BUILDS, {
    onCompleted: () => {
      /**@todo: start polling only if there are active builds and stop polling when all builds are completed */
      startPolling(POLL_INTERVAL);
    },
    variables: {
      appId: applicationId,
    },
  });

  //start polling with cleanup
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

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

export const GET_BUILDS = gql`
  query builds($appId: String!) {
    builds(where: { app: { id: $appId } }, orderBy: { createdAt: Desc }) {
      id
      appId
      app {
        environments {
          id
        }
      }
      version
      message
      createdAt
      actionId
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
