import React, { useState } from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { Snackbar } from "@rmwc/snackbar";
import "@rmwc/snackbar/styles";
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

const BuildList = ({ applicationId }: Props) => {
  const [error, setError] = useState<Error>();
  const { data, error: errorLoading } = useQuery<{
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
      createdAt
      appId
      version
      message
      createdAt
      actionId
      action {
        id
        steps {
          id
          name
          completedAt
          status
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
      deployments {
        id
        createdAt
        actionId
        status
        message
        environment {
          id
          name
          address
          url
        }
      }
    }
  }
`;
