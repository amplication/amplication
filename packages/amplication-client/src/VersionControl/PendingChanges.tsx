import React, { useState, useCallback, useEffect, useContext } from "react";
import { gql, useQuery } from "@apollo/client";
import { isEmpty } from "lodash";
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

const CLASS_NAME = "pending-changes";

type TData = {
  pendingChanges: models.PendingChange[];
};

type Props = {
  resourceId: string;
};

const PendingChanges = ({ resourceId }: Props) => {
  const [discardDialogOpen, setDiscardDialogOpen] = useState<boolean>(false);
  const { currentWorkspace, currentProject, pendingChanges } = useContext(AppContext);

  const { data, loading, error, refetch } = useQuery<TData>(
    GET_PENDING_CHANGES,
    {
      variables: {
        resourceId,
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

  return (
    <div className={CLASS_NAME}>
      <Commit resourceId={resourceId} noChanges={noChanges} />
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
            to={`/${currentWorkspace?.id}/${currentProject?.id}/${resourceId}/pending-changes`}
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
              resourceId={resourceId}
              onComplete={handleDiscardDialogCompleted}
              onCancel={handleToggleDiscardDialog}
            />
          </Dialog>

          {loading ? (
            <span>Loading...</span>
          ) : (
            <div className={`${CLASS_NAME}__changes`}>
              {data?.pendingChanges.map((change) => (
                <PendingChange
                  key={change.resourceId}
                  change={change}
                  resourceId={resourceId}
                  linkToResource
                />
              ))}
            </div>
          )}
        </>
      )}
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </div>
  );
};

export default PendingChanges;

export const GET_PENDING_CHANGES = gql`
  query pendingChanges($resourceId: String!) {
    pendingChanges(where: { resource: { id: $resourceId } }) {
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
  }
`;
