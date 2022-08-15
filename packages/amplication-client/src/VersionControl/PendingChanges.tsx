import React, {
  useState,
  useCallback,
  useEffect,
  useContext,
  useMemo,
} from "react";
import { gql, useQuery } from "@apollo/client";
import { groupBy, isEmpty } from "lodash";
import { Link } from "react-router-dom";

import { formatError } from "../util/error";
import * as models from "../models";
import PendingChange from "./PendingChange";
import { Button, EnumButtonStyle } from "../Components/Button";
import { Dialog, Snackbar, Tooltip } from "@amplication/design-system";
import Commit from "./Commit";
import DiscardChanges from "./DiscardChanges";
import { SvgThemeImage, EnumImages } from "../Components/SvgThemeImage";

import "./PendingChanges.scss";
import { AppContext } from "../context/appContext";
import ResourceCircleBadge from "../Components/ResourceCircleBadge";

const CLASS_NAME = "pending-changes";

type TData = {
  pendingChanges: models.PendingChange[];
};

type Props = {
  projectId: string;
};

const PendingChanges = ({ projectId }: Props) => {
  const [discardDialogOpen, setDiscardDialogOpen] = useState<boolean>(false);
  const { currentWorkspace, currentProject, pendingChanges } = useContext(
    AppContext
  );

  const { data, loading, error, refetch } = useQuery<TData>(
    GET_PENDING_CHANGES,
    {
      variables: {
        projectId,
      },
    }
  );

  //refetch when pending changes object change
  useEffect(() => {
    refetch().catch(console.error);
  }, [refetch, pendingChanges]);

  const handleToggleDiscardDialog = useCallback(() => {
    setDiscardDialogOpen(!discardDialogOpen);
  }, [discardDialogOpen, setDiscardDialogOpen]);

  const handleDiscardDialogCompleted = useCallback(() => {
    setDiscardDialogOpen(false);
  }, []);

  const errorMessage = formatError(error);

  const noChanges = isEmpty(data?.pendingChanges);

  const pendingChangesByResource = useMemo(() => {
    const groupedChanges = groupBy(
      data?.pendingChanges,
      (change) => change.resource.id
    );

    return Object.entries(groupedChanges).map(([resourceId, changes]) => {
      return {
        resource: changes[0].resource,
        changes: changes,
      };
    });
  }, [data]);

  return (
    <div className={CLASS_NAME}>
      <Commit projectId={projectId} noChanges={noChanges} />

      {isEmpty(data?.pendingChanges) && !loading ? (
        <div className={`${CLASS_NAME}__empty-state`}>
          <SvgThemeImage image={EnumImages.NoChanges} />
          <div className={`${CLASS_NAME}__empty-state__title`}>
            No pending changes! keep working.
          </div>
        </div>
      ) : (
        <>
          <Dialog
            className="discard-dialog"
            isOpen={discardDialogOpen}
            onDismiss={handleToggleDiscardDialog}
            title="Discard Changes"
          >
            <DiscardChanges
              projectId={projectId}
              onComplete={handleDiscardDialogCompleted}
              onCancel={handleToggleDiscardDialog}
            />
          </Dialog>

          <div className={`${CLASS_NAME}__changes-wrapper`}>
            {loading ? (
              <span>Loading...</span>
            ) : (
              <div className={`${CLASS_NAME}__changes`}>
                {pendingChangesByResource.map((group) => (
                  <div key={group.resource.id}>
                    <div className={`${CLASS_NAME}__changes__resource`}>
                      <ResourceCircleBadge
                        type={group.resource.resourceType}
                        size="xsmall"
                      />
                      <span>{group.resource.name}</span>
                    </div>
                    {group.changes.map((change) => (
                      <PendingChange
                        key={change.originId}
                        change={change}
                        resourceId={projectId}
                        linkToOrigin
                      />
                    ))}
                  </div>
                ))}
              </div>
            )}
            <hr className={`${CLASS_NAME}__divider`} />
            <div className={`${CLASS_NAME}__changes-header`}>
              <span>Changes</span>
              <span
                className={
                  data?.pendingChanges.length
                    ? `${CLASS_NAME}__changes-count-warning`
                    : `${CLASS_NAME}__changes-count`
                }
              >
                {data?.pendingChanges.length}
              </span>
              <div className="spacer" />
              <Tooltip aria-label={"Compare Changes"} direction="sw">
                <Link
                  to={`/${currentWorkspace?.id}/${currentProject?.id}/pending-changes`}
                >
                  <Button
                    buttonStyle={EnumButtonStyle.Text}
                    disabled={loading || noChanges}
                    icon="compare"
                  />
                </Link>
              </Tooltip>
              <Tooltip aria-label={"Discard Pending Changes"} direction="sw">
                <Button
                  buttonStyle={EnumButtonStyle.Text}
                  onClick={handleToggleDiscardDialog}
                  disabled={loading || noChanges}
                  icon="trash_2"
                />
              </Tooltip>
            </div>
          </div>
        </>
      )}
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </div>
  );
};

export default PendingChanges;

export const GET_PENDING_CHANGES = gql`
  query pendingChanges($projectId: String!) {
    pendingChanges(where: { project: { id: $projectId } }) {
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
      resource {
        id
        name
        resourceType
      }
    }
  }
`;
