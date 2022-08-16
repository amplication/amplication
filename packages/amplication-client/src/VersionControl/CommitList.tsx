import React, { useEffect, useContext } from "react";
import { gql, useQuery } from "@apollo/client";

import { formatError } from "../util/error";
import * as models from "../models";

import { Snackbar, CircularProgress } from "@amplication/design-system";
import "./CommitList.scss";
import { AppContext } from "../context/appContext";
import { CommitListItem } from "./CommitListItem";
import { useHistory } from "react-router-dom";
type TData = {
  commits: models.Commit[];
};

const CREATED_AT_FIELD = "createdAt";

const POLL_INTERVAL = 10000;
// const CLASS_NAME = "commit-list";

type Props = {
  commitId: string;
};

const CommitList = ({ commitId }: Props) => {
  const history = useHistory();
  const { currentProject, currentWorkspace } = useContext(AppContext);
  const { data, loading, error, refetch, stopPolling, startPolling } = useQuery<
    TData
  >(GET_COMMITS, {
    variables: {
      projectId: currentProject?.id,
      orderBy: {
        [CREATED_AT_FIELD]: models.SortOrder.Desc,
      },
    },
  });

  //start polling with cleanup
  useEffect(() => {
    refetch().catch(console.error);
    startPolling(POLL_INTERVAL);
    return () => {
      stopPolling();
    };
  }, [refetch, stopPolling, startPolling]);

  useEffect(() => {
    if (commitId) return;
    history.push(
      `/${currentWorkspace?.id}/${currentProject?.id}/commits/${data?.commits[0].id}`
    );
  }, [commitId, currentProject?.id, currentWorkspace?.id, data?.commits, history]);

  const errorMessage = formatError(error);

  return (
    <>
      {loading && <CircularProgress />}
      {currentProject &&
        data?.commits.map((commit) => (
          <CommitListItem
            key={commit.id}
            commit={commit}
            projectId={currentProject.id}
          />
        ))}
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </>
  );
};

export default CommitList;

/**@todo: expand search on other field  */
export const GET_COMMITS = gql`
  query commits($projectId: String!, $orderBy: CommitOrderByInput) {
    commits(where: { project: { id: $projectId } }, orderBy: $orderBy) {
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
