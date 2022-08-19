import React, { useState, useCallback } from "react";
import PageContent from "../Layout/PageContent";
import PendingChangeWithCompare from "./PendingChangeWithCompare";
import { EnumCompareType } from "./PendingChangeDiffEntity";
import { MultiStateToggle, Snackbar } from "@amplication/design-system";
import "./PendingChangesPage.scss";
import { gql } from "@apollo/client";
import { AppRouteProps } from "../routes/routesUtil";
import { match } from "react-router-dom";
import { PendingChange } from "../models";
import { formatError } from "../util/error";
import useCommits from "./hooks/useCommits";

const CLASS_NAME = "changes-page";
const SPLIT = "Split";
const UNIFIED = "Unified";

const OPTIONS = [
  { value: UNIFIED, label: UNIFIED },
  { value: SPLIT, label: SPLIT },
];

type Props = AppRouteProps & {
  match: match<{
    workspace: string;
    project: string;
    resource: string;
    commit: string;
  }>;
};

const ChangesPage: React.FC<Props> = ({ match }) => {
  const commitId = match.params.commit;
  const resourceId = match.params.resource;
  const [splitView, setSplitView] = useState<boolean>(false);
  const pageTitle = "Changes";
  const { commitChangesByResource, commitsError } = useCommits();

  const commitResourceChanges = commitChangesByResource(commitId).find(
    (resource) => resource.resourceId === resourceId
  )?.changes;

  const handleChangeType = useCallback(
    (type: string) => {
      setSplitView(type === SPLIT);
    },
    [setSplitView]
  );

  const errorMessage = formatError(commitsError);

  return (
    <>
      <PageContent className={CLASS_NAME} pageTitle={pageTitle}>
        <div className={`${CLASS_NAME}__header`}>
          <h1>Changes Page</h1>
          <MultiStateToggle
            label=""
            name="compareMode"
            options={OPTIONS}
            onChange={handleChangeType}
            selectedValue={splitView ? SPLIT : UNIFIED}
          />
        </div>
        <div className={`${CLASS_NAME}__changes`}>
          {commitResourceChanges &&
            commitResourceChanges.map((change: PendingChange) => (
              <PendingChangeWithCompare
                key={change.originId}
                change={change}
                compareType={EnumCompareType.Previous}
                splitView={splitView}
              />
            ))}
        </div>
      </PageContent>
      <Snackbar open={Boolean(commitsError)} message={errorMessage} />
    </>
  );
};

export default ChangesPage;

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
            lockedByUser {
              account {
                firstName
                lastName
              }
            }
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
