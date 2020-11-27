import React, { useMemo, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { CircularProgress } from "@rmwc/circular-progress";
import { isEmpty } from "lodash";
import { formatError } from "../util/error";
import * as models from "../models";
import Build from "./Build";

type TData = {
  builds: models.Build[];
};

type Props = {
  applicationId: string;
};

const LastBuild = ({ applicationId }: Props) => {
  const [error, setError] = useState<Error>();

  const { data, loading, error: errorLoading } = useQuery<TData>(
    GET_LAST_BUILD,
    {
      variables: {
        appId: applicationId,
      },
    }
  );

  const lastBuild = useMemo(() => {
    if (loading || isEmpty(data?.builds)) return null;
    const [last] = data?.builds;
    return last;
  }, [loading, data]);

  const errorMessage =
    formatError(errorLoading) || (error && formatError(error));

  return (
    <>
      {Boolean(error) && errorMessage}

      {loading ? (
        <CircularProgress />
      ) : lastBuild ? (
        <Build build={lastBuild} open onError={setError} />
      ) : (
        <h1>
          Create Your <span>First Build</span>
        </h1>
      )}
    </>
  );
};

export default LastBuild;

export const GET_LAST_BUILD = gql`
  query lastBuild($appId: String!) {
    builds(
      where: { app: { id: $appId } }
      orderBy: { createdAt: Desc }
      take: 1
    ) {
      id
      createdAt
      appId
      version
      message
      createdAt
      commitId
      actionId
      action {
        id
        createdAt
        steps {
          id
          name
          createdAt
          message
          status
          completedAt
        }
      }
      createdBy {
        id
        account {
          firstName
          lastName
        }
      }
      status
      archiveURI
      deployments(orderBy: { createdAt: Desc }, take: 1) {
        id
        buildId
        createdAt
        status
        actionId
        action {
          id
          createdAt
          steps {
            id
            name
            createdAt
            message
            status
            completedAt
          }
        }
        message
        environment {
          id
          name
          address
        }
      }
    }
  }
`;
