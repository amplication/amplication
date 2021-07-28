import React, { useMemo, useState, useContext } from "react";
import { gql, useQuery } from "@apollo/client";
import classNames from "classnames";
import { isEmpty } from "lodash";
import { formatError } from "../util/error";
import { CircularProgress } from "@rmwc/circular-progress";
import * as models from "../models";
import { UserAndTime } from "@amplication/design-system";
import { Tooltip } from "@primer/components";
import { ClickableId } from "../Components/ClickableId";
import BuildSummary from "./BuildSummary";
import BuildHeader from "./BuildHeader";
import PendingChangesContext from "./PendingChangesContext";
import "./LastCommit.scss";

type TData = {
  commits: models.Commit[];
};

type Props = {
  applicationId: string;
};

const CLASS_NAME = "last-commit";

const LastCommit = ({ applicationId }: Props) => {
  const pendingChangesContext = useContext(PendingChangesContext);
  const [error, setError] = useState<Error>();

  const { data, loading, error: errorLoading, refetch } = useQuery<TData>(
    GET_LAST_COMMIT,
    {
      variables: {
        applicationId,
      },
    }
  );

  React.useEffect(() => {
    refetch();
    return () => {
      refetch();
    };
  }, [pendingChangesContext.isError, refetch]);

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

  const ClickableCommitId = (
    <ClickableId
      to={`/${build?.appId}/commits/${lastCommit.id}`}
      id={lastCommit.id}
      label="Last commit"
      eventData={{
        eventName: "lastCommitIdClick",
      }}
    />
  );

  return (
    <div
      className={classNames(`${CLASS_NAME}`, {
        [`${CLASS_NAME}__generating`]: pendingChangesContext.commitRunning,
      })}
    >
      {Boolean(error) && errorMessage}
      {pendingChangesContext.commitRunning ? (
        <div className={`${CLASS_NAME}__loading`}>
          <CircularProgress /> Generating new build...
        </div>
      ) : (
        <>
          {isEmpty(lastCommit?.message) ? (
            ClickableCommitId
          ) : (
            <Tooltip aria-label={lastCommit?.message} direction="ne">
              {ClickableCommitId}
            </Tooltip>
          )}
          <UserAndTime account={account} time={lastCommit.createdAt} />

          {build && (
            <>
              <BuildHeader
                build={build}
                isError={pendingChangesContext.isError}
              />
              <BuildSummary build={build} onError={setError} />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default LastCommit;

export const GET_LAST_COMMIT = gql`
  query lastCommit($applicationId: String!) {
    commits(
      where: { app: { id: $applicationId } }
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
