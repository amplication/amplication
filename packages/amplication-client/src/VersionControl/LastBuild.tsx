import React, { useMemo, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { CircularProgress } from "@amplication/design-system";
import { isEmpty } from "lodash";
import { formatError } from "../util/error";
import * as models from "../models";
import Build from "./Build";

type TData = {
  builds: models.Build[];
};

type Props = {
  resourceId: string;
};

const LastBuild = ({ resourceId }: Props) => {
  const [error, setError] = useState<Error>();

  const { data, loading, error: errorLoading } = useQuery<TData>(
    GET_LAST_BUILD,
    {
      variables: {
        resourceId: resourceId,
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
  query lastBuild($resourceId: String!) {
    builds(
      where: { resource: { id: $resourceId } }
      orderBy: { createdAt: Desc }
      take: 1
    ) {
      id
      createdAt
      resourceId
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
    }
  }
`;
