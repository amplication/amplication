import React, { useState, useCallback, useContext } from "react";
import { match } from "react-router-dom";
import PageContent from "../Layout/PageContent";
import useNavigationTabs from "../Layout/UseNavigationTabs";
import PendingChangeWithCompare from "./PendingChangeWithCompare";
import { EnumCompareType } from "./PendingChangeDiffEntity";
import { MultiStateToggle } from "@amplication/design-system";
import "./PendingChangesPage.scss";
import { AppContext } from "../context/appContext";
import { gql } from "@apollo/client";

type Props = {
  match: match<{ project: string; resource: string; commitId: string }>;
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
  const { project } = match.params;
  const [splitView, setSplitView] = useState<boolean>(false);
  const pageTitle = "Pending Changes";
  useNavigationTabs(project, NAVIGATION_KEY, match.url, pageTitle);
  const { pendingChanges } = useContext(AppContext);

  const handleChangeType = useCallback(
    (type: string) => {
      setSplitView(type === SPLIT);
    },
    [setSplitView]
  );

  // const errorMessage = formatError({ message: "", name: "" });

  return (
    <>
      <PageContent className={CLASS_NAME} pageTitle={pageTitle}>
        {!pendingChanges.length ? (
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
          {pendingChanges.map((change) => (
            <PendingChangeWithCompare
              key={change.originId}
              change={change}
              compareType={EnumCompareType.Pending}
              splitView={splitView}
            />
          ))}
        </div>
      </PageContent>
      {/* <Snackbar open={Boolean(error)} message={errorMessage} /> */}
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
