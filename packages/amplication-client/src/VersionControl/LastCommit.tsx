import React, { useMemo, useContext, useCallback } from "react";
import { gql, useQuery } from "@apollo/client";
import classNames from "classnames";
import { isEmpty } from "lodash";
import * as models from "../models";
import {
  Tooltip,
  SkeletonWrapper,
  Button,
  EnumButtonStyle,
  Icon,
} from "@amplication/design-system";
import { ClickableId } from "../Components/ClickableId";
import "./LastCommit.scss";
import { AppContext } from "../context/appContext";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

type TData = {
  commits: models.Commit[];
};

type Props = {
  projectId: string;
};

const CLASS_NAME = "last-commit";

const LastCommit = ({ projectId }: Props) => {
  const {
    currentWorkspace,
    currentProject,
    commitRunning,
    pendingChangesIsError,
  } = useContext(AppContext);

  const { data, loading, refetch } = useQuery<TData>(GET_LAST_COMMIT, {
    variables: {
      projectId,
    },
  });

  React.useEffect(() => {
    refetch();
    return () => {
      refetch();
    };
  }, [pendingChangesIsError, refetch]);

  const lastCommit = useMemo(() => {
    if (loading || isEmpty(data?.commits)) return null;
    const [last] = data?.commits || [];
    return last;
  }, [loading, data]);

  // formatTimeToNow returns "about x time ago and I want to remove the word /about/"
  const removeFirstWord = useCallback((str: string | null) => {
    if (!str) return null;
    const indexOfSpace = str.indexOf(" ");
    return str.substring(indexOfSpace + 1);
  }, []);

  const formattedTime = useMemo(() => {
    return removeFirstWord(formatTimeToNow(lastCommit?.createdAt));
  }, [lastCommit?.createdAt, removeFirstWord]);

  const build = useMemo(() => {
    if (!lastCommit) return null;
    const [last] = lastCommit.builds || [];
    return last;
  }, [lastCommit]);

  if (!lastCommit) return null;

  const ClickableCommitId = (
    <ClickableId
      to={`/${currentWorkspace?.id}/${currentProject?.id}/commits/${lastCommit.id}`}
      id={lastCommit.id}
      label="Commit"
      eventData={{
        eventName: "lastCommitIdClick",
      }}
    />
  );

  const generating = commitRunning;

  return (
    <div
      className={classNames(`${CLASS_NAME}`, {
        [`${CLASS_NAME}__generating`]: generating,
      })}
    >
      <hr className={`${CLASS_NAME}__divider`} />
      <div className={`${CLASS_NAME}__content`}>
        <p className={`${CLASS_NAME}__title`}>Last Commit</p>
        <SkeletonWrapper
          showSkeleton={generating}
          className={`${CLASS_NAME}__skeleton`}
        >
          <Icon icon="circle" />
          {isEmpty(lastCommit?.message) ? (
            ClickableCommitId
          ) : (
            <Tooltip aria-label={lastCommit?.message} direction="ne">
              {ClickableCommitId}
            </Tooltip>
          )}
          <span className={classNames("clickable-id")}>{formattedTime}</span>
        </SkeletonWrapper>
        {build && (
          <Link
            to={`/${currentWorkspace?.id}/${currentProject?.id}/${build.resourceId}/code-view`}
            className={`${CLASS_NAME}__view-code`}
          >
            <Button
              buttonStyle={EnumButtonStyle.Secondary}
              disabled={generating}
              eventData={{
                eventName: "LastCommitViewCode",
              }}
            >
              GO To View Code
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

function formatTimeToNow(time: Date | null): string | null {
  return (
    time &&
    formatDistanceToNow(new Date(time), {
      addSuffix: true,
    })
  );
}

export default LastCommit;

export const GET_LAST_COMMIT = gql`
  query lastCommit($projectId: String!) {
    commits(
      where: { project: { id: $projectId } }
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
