import React, { useMemo } from "react";
import { match } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import * as models from "../models";

import PageContent from "../Layout/PageContent";
import { Snackbar } from "@rmwc/snackbar";
import { formatError } from "../util/error";

import useNavigationTabs from "../Layout/UseNavigationTabs";
import { EnumCompareType } from "./PendingChangeDiff";
import PendingChangeWithCompare from "./PendingChangeWithCompare";
import { TruncatedId } from "../Components/TruncatedId";
import { ClickableId } from "../Components/ClickableId";
import { truncateId } from "../util/truncatedId";

import "./CommitPage.scss";

type Props = {
  match: match<{ application: string; commitId: string }>;
};
const CLASS_NAME = "commit-page";
const NAVIGATION_KEY = "COMMITS";

const CommitPage = ({ match }: Props) => {
  const { application, commitId } = match.params;

  const truncatedId = useMemo(() => {
    return truncateId(commitId);
  }, [commitId]);

  useNavigationTabs(
    `${NAVIGATION_KEY}_${commitId}`,
    match.url,
    `Commit ${truncatedId}`
  );

  const { data, error } = useQuery<{
    commit: models.Commit;
  }>(GET_COMMIT, {
    variables: {
      commitId: commitId,
    },
  });
  const build =
    (data?.commit?.builds &&
      data?.commit?.builds.length &&
      data.commit.builds[0]) ||
    null;

  const errorMessage = formatError(error);
  return (
    <>
      <PageContent className={CLASS_NAME}>
        {!data ? (
          "loading..."
        ) : (
          <>
            <div className={`${CLASS_NAME}__header`}>
              <h2>
                Commit <TruncatedId id={data.commit.id} />
              </h2>
              {build && (
                <ClickableId
                  label="Build"
                  to={`/${application}/builds/${build.id}`}
                  id={build.id}
                  eventData={{
                    eventName: "buildHeaderIdClick",
                  }}
                />
              )}
            </div>
            <div className={`${CLASS_NAME}__commit-message`}>
              {data.commit.message}
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
