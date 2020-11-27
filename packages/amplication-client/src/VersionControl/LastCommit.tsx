import React, { useMemo, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { isEmpty } from "lodash";
import { formatError } from "../util/error";
import { Link } from "react-router-dom";
import * as models from "../models";
import { Panel, EnumPanelStyle, PanelHeader } from "../Components/Panel";
import { ClickableId } from "../Components/ClickableId";
import BuildSteps from "./BuildSteps";
import BuildHeader from "./BuildHeader";
import UserAndTime from "../Components/UserAndTime";
import "./LastCommit.scss";

type TData = {
  commits: models.Commit[];
};

type Props = {
  applicationId: string;
};

const CLASS_NAME = "last-commit";

const LastCommit = ({ applicationId }: Props) => {
  const [error, setError] = useState<Error>();

  const { data, loading, error: errorLoading } = useQuery<TData>(
    GET_LAST_COMMIT,
    {
      variables: {
        appId: applicationId,
      },
    }
  );

  const lastCommit = useMemo(() => {
    if (loading || isEmpty(data?.commits)) return null;
    const [last] = data?.commits;
    return last;
  }, [loading, data]);

  const build = useMemo(() => {
    if (!lastCommit) return null;
    const [last] = lastCommit.builds;
    return last;
  }, [lastCommit]);

  const errorMessage =
    formatError(errorLoading) || (error && formatError(error));

  const account = lastCommit?.user?.account;

  if (!lastCommit) return null;

  return (
    <Panel panelStyle={EnumPanelStyle.Transparent} className={`${CLASS_NAME}`}>
      <PanelHeader>
        <h3>Last Commit</h3>
        <Link to={`/${applicationId}/commits`}>View All</Link>
      </PanelHeader>
      {Boolean(error) && errorMessage}
      <ClickableId
        to={`/${build?.appId}/commits/${lastCommit.id}`}
        id={lastCommit.id}
        label="Commit ID"
      />
      <div className={`${CLASS_NAME}__message`}>{lastCommit?.message}</div>
      <UserAndTime account={account} time={lastCommit.createdAt} />
      {build && (
        <>
          <BuildHeader build={build} deployments={build.deployments} />
          <BuildSteps build={build} onError={setError} />
        </>
      )}
    </Panel>
  );
};

export default LastCommit;

export const GET_LAST_COMMIT = gql`
  query lastCommit($appId: String!) {
    commits(
      where: { app: { id: $appId } }
      orderBy: { createdAt: Desc }
      take: 1
    ) {
      id
      message
      createdAt
      user {
        id
        account {
          firstName
          lastName
        }
      }
      changes {
        resourceId
        action
        resourceType
        versionNumber
        resource {
          __typename
          ... on Entity {
            id
            displayName
            updatedAt
          }
          ... on Block {
            id
            displayName
            updatedAt
          }
        }
      }
      builds(orderBy: { createdAt: Desc }, take: 1) {
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
            logs {
              id
              createdAt
              message
              meta
              level
            }
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
          message
          environment {
            id
            name
            address
          }
        }
      }
    }
  }
`;
