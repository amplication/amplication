import React from "react";
import { match } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import * as models from "../models";

import PageContent from "../Layout/PageContent";
import FloatingToolbar from "../Layout/FloatingToolbar";
import { Snackbar } from "@rmwc/snackbar";
import { formatError } from "../util/error";

import useBreadcrumbs from "../Layout/use-breadcrumbs";
import UserAndTime from "../Components/UserAndTime";
import { TruncatedId } from "../Components/TruncatedId";
import { EnumCompareType } from "./PendingChangeDiff";
import PendingChangeWithCompare from "./PendingChangeWithCompare";

import "./CommitPage.scss";

type Props = {
  match: match<{ application: string; commitId: string }>;
};
const CLASS_NAME = "commit-page";

const CommitPage = ({ match }: Props) => {
  const { commitId } = match.params;
  useBreadcrumbs(match.url, "Commit");

  const { data, error } = useQuery<{
    commit: models.Commit;
  }>(GET_COMMIT, {
    variables: {
      commitId: commitId,
    },
  });

  const errorMessage = formatError(error);

  const account = data?.commit?.user?.account;

  return (
    <>
      <PageContent className={CLASS_NAME} withFloatingBar>
        <main>
          <FloatingToolbar />
          {!data ? (
            "loading..."
          ) : (
            <>
              <div className={`${CLASS_NAME}__header`}>
                <h1>
                  Commit <TruncatedId id={data.commit.id} />
                </h1>
                <div className="spacer" />
              </div>
              <div className={`${CLASS_NAME}__sub-header`}>
                <UserAndTime account={account} time={data?.commit.createdAt} />
                <span className={`${CLASS_NAME}__message`}>
                  {data.commit.message}
                </span>
              </div>
            </>
          )}
          {data?.commit?.changes && (
            <div className={`${CLASS_NAME}__changes`}>
              <h3 className={`${CLASS_NAME}__changes__count`}>
                {data.commit.changes.length} Changes
              </h3>
              {data.commit.changes.map((change) => (
                <PendingChangeWithCompare
                  key={change.resourceId}
                  change={change}
                  compareType={EnumCompareType.Previous}
                />
              ))}
            </div>
          )}
        </main>
      </PageContent>
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </>
  );
};

export default CommitPage;

export const GET_COMMIT = gql`
  query Commit($commitId: String!) {
    commit(where: { id: $commitId }) {
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
      }
    }
  }
`;
