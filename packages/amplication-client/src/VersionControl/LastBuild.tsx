import React, { useMemo } from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { CircularProgress } from "@rmwc/circular-progress";
import { isEmpty } from "lodash";
import { formatError } from "../util/error";
import * as models from "../models";
import { EnumPanelStyle, Panel, PanelHeader } from "../Components/Panel";
import UserAndTime from "../Components/UserAndTime";
import "./LastBuild.scss";

const CLASS_NAME = "last-build";

type TData = {
  builds: models.Build[];
};

type Props = {
  applicationId: string;
};

const LastBuild = ({ applicationId }: Props) => {
  const { data, loading, error } = useQuery<TData>(GET_LAST_BUILD, {
    variables: {
      appId: applicationId,
    },
  });

  const lastBuild = useMemo(() => {
    if (loading || isEmpty(data?.builds)) return null;
    const [last] = data?.builds;
    return last;
  }, [loading, data]);

  const errorMessage = formatError(error);

  return (
    <Panel className={CLASS_NAME} panelStyle={EnumPanelStyle.Transparent}>
      {Boolean(error) && errorMessage}

      <PanelHeader>
        {loading ? (
          <h1>
            Last Build
            <CircularProgress />
          </h1>
        ) : lastBuild ? (
          <>
            <h1>
              Current Build <span>{lastBuild?.version}</span>
            </h1>
            <UserAndTime
              account={lastBuild?.createdBy?.account}
              time={lastBuild?.createdAt}
            />
          </>
        ) : (
          <h1>
            Create Your <span>First Build</span>
          </h1>
        )}
      </PanelHeader>

      <div className={`${CLASS_NAME}__details`}>
        <span>{lastBuild?.message}</span>
      </div>
    </Panel>
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
      deployments(orderBy: { createdAt: Desc }, take: 1) {
        id
        buildId
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
