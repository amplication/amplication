import React, { useState, useCallback, useContext } from "react";
import PageContent from "../Layout/PageContent";
import PendingChangeWithCompare from "./PendingChangeWithCompare";
import { EnumCompareType } from "./PendingChangeDiffEntity";
import {
  EnumFlexItemContentDirection,
  EnumFlexItemMargin,
  EnumTextStyle,
  FlexItem,
  HorizontalRule,
  MultiStateToggle,
  Snackbar,
  Text,
} from "@amplication/ui/design-system";
import "./PendingChangesPage.scss";
import { AppContext } from "../context/appContext";
import { gql } from "@apollo/client";
import usePendingChanges from "../Workspaces/hooks/usePendingChanges";
import { formatError } from "../util/error";
import PendingChanges from "./PendingChanges";
import PendingChangesList from "./PendingChangesList";

const CLASS_NAME = "pending-changes-page";
const SPLIT = "Split";
const UNIFIED = "Unified";

const OPTIONS = [
  { value: UNIFIED, label: UNIFIED },
  { value: SPLIT, label: SPLIT },
];

const PendingChangesPage = () => {
  const [splitView, setSplitView] = useState<boolean>(false);
  const pageTitle = "Pending Changes";
  const { currentProject } = useContext(AppContext);
  const {
    pendingChangesByResource,
    pendingChangesDataError,
    pendingChangesIsError,
  } = usePendingChanges(currentProject);

  const handleChangeType = useCallback(
    (type: string) => {
      setSplitView(type === SPLIT);
    },
    [setSplitView]
  );

  const errorMessage = formatError(pendingChangesDataError);

  return (
    <>
      <PageContent
        className={CLASS_NAME}
        pageTitle={pageTitle}
        sideContent={
          <>
            <FlexItem margin={EnumFlexItemMargin.Bottom}>
              <Text textStyle={EnumTextStyle.H4}>Pending changes</Text>
            </FlexItem>
            <PendingChangesList />
          </>
        }
      >
        <Text textStyle={EnumTextStyle.H4}>Commit Changes</Text>
        <PendingChanges projectId={currentProject?.id} />

        <HorizontalRule />

        <FlexItem contentDirection={EnumFlexItemContentDirection.Row}>
          <FlexItem.FlexStart>
            <Text textStyle={EnumTextStyle.H4}>Compare Changes</Text>
          </FlexItem.FlexStart>
          <FlexItem.FlexEnd>
            <MultiStateToggle
              className={`${CLASS_NAME}__toggle`}
              label=""
              name="compareMode"
              options={OPTIONS}
              onChange={handleChangeType}
              selectedValue={splitView ? SPLIT : UNIFIED}
            />
          </FlexItem.FlexEnd>
        </FlexItem>

        <div className={`${CLASS_NAME}__changes`}>
          {pendingChangesByResource.map((resourceChanges) => (
            <div key={resourceChanges.resource.id}>
              <div className={`${CLASS_NAME}__title`}>
                {resourceChanges.resource.name}
              </div>
              {resourceChanges.changes.map((change) => (
                <PendingChangeWithCompare
                  key={change.originId}
                  change={change}
                  compareType={EnumCompareType.Pending}
                  splitView={splitView}
                />
              ))}
            </div>
          ))}
          <div />
        </div>
      </PageContent>
      <Snackbar open={Boolean(pendingChangesIsError)} message={errorMessage} />
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
