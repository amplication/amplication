import React, { useMemo, useState, useContext } from "react";
import { gql, useQuery } from "@apollo/client";
import classNames from "classnames";
import { isEmpty } from "lodash";
import { formatError } from "../util/error";
import * as models from "../models";
import {
  UserAndTime,
  Tooltip,
  SkeletonWrapper,
} from "@amplication/design-system";
import { ClickableId } from "../Components/ClickableId";
import BuildSummary from "./BuildSummary";
import BuildHeader from "./BuildHeader";
import PendingChangesContext from "./PendingChangesContext";
import "./LastCommit.scss";
import PendingChangesMenuItem from "../VersionControl/PendingChangesMenuItem";

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

  const generating = pendingChangesContext.commitRunning;

  return (
    <div
      className={classNames(`${CLASS_NAME}`, {
        [`${CLASS_NAME}__generating`]: generating,
      })}
    >
      {Boolean(error) && errorMessage}

      <SkeletonWrapper showSkeleton={generating}>
        {isEmpty(lastCommit?.message) ? (
          ClickableCommitId
        ) : (
          <Tooltip aria-label={lastCommit?.message} direction="ne">
            {ClickableCommitId}
          </Tooltip>
        )}
      </SkeletonWrapper>
      <UserAndTime
        loading={generating}
        account={account}
        time={lastCommit.createdAt}
      />

      {build && (
        <>
          <SkeletonWrapper showSkeleton={generating}>
            <BuildHeader
              build={build}
              isError={pendingChangesContext.isError}
            />
          </SkeletonWrapper>

          <BuildSummary
            build={build}
            onError={setError}
            generating={generating}
          />
        </>
      )}

      <PendingChangesMenuItem applicationId={applicationId} />
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
        originId
        action
        originType
        versionNumber
        origin {
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
      }
    }
  }
`;
