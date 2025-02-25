import { useCallback, useState } from "react";

import { Button, EnumButtonStyle } from "../Components/Button";
import * as models from "../models";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import { useTracking } from "../util/analytics";
import { Reference, gql, useMutation } from "@apollo/client";

import {
  ConfirmationDialog,
  EnumButtonState,
  Snackbar,
} from "@amplication/ui/design-system";
import { useStiggContext } from "@stigg/react-sdk";
import { useAppContext } from "../context/appContext";
import { formatError } from "../util/error";
import { GET_OUTDATED_VERSION_ALERTS } from "../OutdatedVersionAlerts/hooks/outdatedVersionAlertsQueries";
import { useHistory } from "react-router-dom";
import { useProjectBaseUrl } from "../util/useProjectBaseUrl";

type TDeleteResourceData = {
  deleteResource: models.Resource;
};

type Props = {
  resource: models.Resource;
  disabled?: boolean;
};

const CONFIRM_BUTTON = { label: "Delete" };
const DISMISS_BUTTON = { label: "Dismiss" };

function DeleteResourceButton({ resource, disabled }: Props) {
  const { name, resourceType } = resource;
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const { trackEvent } = useTracking();
  const [error, setError] = useState<Error | null>(null);
  const { baseUrl } = useProjectBaseUrl();

  const { addEntity } = useAppContext();
  const history = useHistory();

  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  const errorMessage = error && formatError(error);

  const [deleteResource] = useMutation<TDeleteResourceData>(DELETE_RESOURCE, {
    refetchQueries: [GET_OUTDATED_VERSION_ALERTS],

    update(cache, { data }) {
      if (!data) return;
      const deletedResourceId = data.deleteResource.id;

      // Evict the deleted item from the cache
      cache.evict({
        id: cache.identify({ __typename: "Resource", id: deletedResourceId }),
      });

      // Run garbage collection to remove any dangling references
      cache.gc();
    },
  });

  const handleDelete = useCallback(
    (event) => {
      event.stopPropagation();
      event.preventDefault();
      setConfirmDelete(true);
      return false;
    },
    [setConfirmDelete]
  );

  const handleDismissDelete = useCallback(() => {
    setConfirmDelete(false);
  }, [setConfirmDelete]);

  const handleResourceDelete = useCallback(
    (resource) => {
      trackEvent({
        eventName: AnalyticsEventNames.ResourceDelete,
      });
      deleteResource({
        onCompleted: () => {
          addEntity();
          history.push(baseUrl);
        },
        variables: {
          resourceId: resource.id,
        },
      }).catch(setError);
    },
    [addEntity, baseUrl, deleteResource, history, trackEvent]
  );

  const handleConfirmDelete = useCallback(() => {
    setConfirmDelete(false);
    handleResourceDelete(resource);
  }, [handleResourceDelete, resource]);

  return (
    <>
      <ConfirmationDialog
        isOpen={confirmDelete}
        title={`Delete '${name}' ?`}
        confirmButton={CONFIRM_BUTTON}
        dismissButton={DISMISS_BUTTON}
        message={
          <span>
            {resourceType === models.EnumResourceType.ProjectConfiguration
              ? "This will permanently delete the entire project and all its resources. Are you sure you want to continue?"
              : "This action cannot be undone. This will permanently delete the resource and its content. Are you sure you want to continue? "}
          </span>
        }
        onConfirm={handleConfirmDelete}
        onDismiss={handleDismissDelete}
      />

      <Button
        buttonStyle={EnumButtonStyle.Primary}
        buttonState={EnumButtonState.Danger}
        icon="trash_2"
        onClick={handleDelete}
        disabled={disabled}
      >
        Delete
      </Button>

      <Snackbar
        open={Boolean(error)}
        message={errorMessage}
        onClose={clearError}
      />
    </>
  );
}

export default DeleteResourceButton;

const DELETE_RESOURCE = gql`
  mutation deleteResource($resourceId: String!) {
    deleteResource(where: { id: $resourceId }) {
      id
    }
  }
`;
