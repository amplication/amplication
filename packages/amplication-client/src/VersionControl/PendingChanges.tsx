import React, { useState, useCallback, useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import { Snackbar } from "@rmwc/snackbar";
import "@rmwc/snackbar/styles";
import { isEmpty } from "lodash";
import { Link } from "react-router-dom";

import imageNoChanges from "../assets/images/no-changes.svg";
import { formatError } from "../util/error";
import * as models from "../models";
import PendingChange from "./PendingChange";
import { Button, EnumButtonStyle } from "../Components/Button";
import { Dialog } from "@amplication/design-system";
import Commit from "./Commit";
import DiscardChanges from "./DiscardChanges";

import "./PendingChanges.scss";

const CLASS_NAME = "pending-changes";
const POLL_INTERVAL = 1000;

type TData = {
  pendingChanges: models.PendingChange[];
};

type Props = {
  applicationId: string;
};

const PendingChanges = ({ applicationId }: Props) => {
  const [discardDialogOpen, setDiscardDialogOpen] = useState<boolean>(false);

  const { data, loading, error, stopPolling, startPolling, refetch } = useQuery<
    TData
  >(GET_PENDING_CHANGES, {
    variables: {
      applicationId,
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

  const handleToggleDiscardDialog = useCallback(() => {
    setDiscardDialogOpen(!discardDialogOpen);
  }, [discardDialogOpen, setDiscardDialogOpen]);

  const handleDiscardDialogCompleted = useCallback(() => {
    setDiscardDialogOpen(false);
  }, []);

  const errorMessage = formatError(error);

  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__header`}>
        <h3>Pending Changes {data?.pendingChanges.length}</h3>
        <div className="spacer" />
        {!loading && (
          <Button
            buttonStyle={EnumButtonStyle.Clear}
            onClick={handleToggleDiscardDialog}
          >
            Discard
          </Button>
        )}
      </div>

      {isEmpty(data?.pendingChanges) && !loading ? (
        <div className={`${CLASS_NAME}__empty-state`}>
          <img src={imageNoChanges} alt="no changes" />

          <div className={`${CLASS_NAME}__empty-state__title`}>
            No pending changes! keep working.
          </div>
        </div>
      ) : (
        <>
          <Commit applicationId={applicationId} />

          <Dialog
            className="discard-dialog"
            isOpen={discardDialogOpen}
            onDismiss={handleToggleDiscardDialog}
            title="Discard Changes"
          >
            <DiscardChanges
              applicationId={applicationId}
              onComplete={handleDiscardDialogCompleted}
              onCancel={handleToggleDiscardDialog}
            />
          </Dialog>

          {loading ? (
            <span>Loading...</span>
          ) : (
            <div className={`${CLASS_NAME}__changes`}>
              <Link
                className={`${CLASS_NAME}__changes__view-details`}
                to={`/${applicationId}/pending-changes`}
              >
                Compare Changes
              </Link>
              {data?.pendingChanges.map((change) => (
                <PendingChange key={change.resourceId} change={change} />
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
  query pendingChanges($applicationId: String!) {
    pendingChanges(where: { app: { id: $applicationId } }) {
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
