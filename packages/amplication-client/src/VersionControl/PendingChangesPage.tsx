import React, { useState, useCallback } from "react";
import { match } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import * as models from "../models";

import PageContent from "../Layout/PageContent";
import { Snackbar } from "@rmwc/snackbar";
import { formatError } from "../util/error";

import useNavigationTabs from "../Layout/UseNavigationTabs";
import PendingChangeWithCompare from "./PendingChangeWithCompare";
import { EnumCompareType } from "./PendingChangeDiffEntity";
import { GET_PENDING_CHANGES } from "./PendingChanges";
import { MultiStateToggle } from "@amplication/design-system";

import "./PendingChangesPage.scss";

type Props = {
  match: match<{ application: string; commitId: string }>;
};

type TData = {
  pendingChanges: models.PendingChange[];
};

const CLASS_NAME = "pending-changes-page";
const NAVIGATION_KEY = "PENDING_CHANGES";
const SPLIT = "Split";
const UNIFIED = "Unified";

const OPTIONS = [
  { value: UNIFIED, label: UNIFIED },
  { value: SPLIT, label: SPLIT },
];

const PendingChangesPage = ({ match }: Props) => {
  const { application } = match.params;
  const [splitView, setSplitView] = useState<boolean>(false);

  useNavigationTabs(application, NAVIGATION_KEY, match.url, "Pending Changes");

  const handleChangeType = useCallback(
    (type: string) => {
      setSplitView(type === SPLIT);
    },
    [setSplitView]
  );
  const { data, error } = useQuery<TData>(GET_PENDING_CHANGES, {
    variables: {
      applicationId: application,
    },
  });

  const errorMessage = formatError(error);

  return (
    <>
      <PageContent className={CLASS_NAME}>
        {!data ? (
          "loading..."
        ) : (
          <div className={`${CLASS_NAME}__header`}>
            <h1>Pending Changes</h1>
            <MultiStateToggle
              label=""
              name="compareMode"
              options={OPTIONS}
              onChange={handleChangeType}
              selectedValue={splitView ? SPLIT : UNIFIED}
            />
          </div>
        )}
        <div className={`${CLASS_NAME}__changes`}>
          {data?.pendingChanges.map((change) => (
            <PendingChangeWithCompare
              key={change.resourceId}
              change={change}
              compareType={EnumCompareType.Pending}
              splitView={splitView}
            />
          ))}
        </div>
      </PageContent>
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </>
  );
};

export default PendingChangesPage;

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
