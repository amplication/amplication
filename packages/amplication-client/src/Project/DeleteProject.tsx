import React, { useCallback, useContext, useState } from "react";
import * as models from "../models";
import {
  ConfirmationDialog,
  Snackbar,
  EnumButtonState,
} from "@amplication/ui/design-system";
import { Button, EnumButtonStyle } from "../Components/Button";
import { formatError } from "../util/error";
import { useTracking } from "../util/analytics";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import { AppContext } from "../context/appContext";
import { useHistory } from "react-router-dom";
import { Reference, gql, useMutation } from "@apollo/client";
import { useStiggContext } from "@stigg/react-sdk";

const CONFIRM_BUTTON = { label: "Delete" };
const DISMISS_BUTTON = { label: "Dismiss" };

type Props = {
  project: models.Project;
  onDelete?: () => void;
};

type TDeleteProjectData = {
  deleteProject: models.Project;
};

export const DeleteProject = ({ project, onDelete }: Props) => {
  const { addEntity, currentWorkspace } = useContext(AppContext);

  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

  const { trackEvent } = useTracking();
  const { refreshData } = useStiggContext();
  const history = useHistory();

  const [error, setError] = useState<Error | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  const handleDismissDelete = useCallback(() => {
    setConfirmDelete(false);
  }, [setConfirmDelete]);

  const handleDelete = useCallback(
    (event) => {
      event.stopPropagation();
      setConfirmDelete(true);
    },
    [setConfirmDelete]
  );

  const [deleteProject] = useMutation<TDeleteProjectData>(DELETE_PROJECT, {
    update(cache, { data }) {
      if (!data) return;
      const deletedProjectId = data.deleteProject.id;

      cache.modify({
        fields: {
          projects(existingProjectRefs, { readField }) {
            return existingProjectRefs.filter(
              (projectRef: Reference) =>
                deletedProjectId !== readField("id", projectRef)
            );
          },
        },
      });
      refreshData();
    },
  });

  const handleConfirmDelete = useCallback(() => {
    trackEvent({
      eventName: AnalyticsEventNames.ProjectDelete,
    });
    deleteProject({
      onCompleted: () => {
        addEntity();
        history.push(`/${currentWorkspace?.id}`);
      },
      variables: {
        projectId: project.id,
      },
    }).catch(setError);
  }, [project, deleteProject, setError, trackEvent]);

  const errorMessage = error && formatError(error);

  return (
    <>
      <ConfirmationDialog
        isOpen={confirmDelete}
        title={`Delete Project?`}
        confirmButton={CONFIRM_BUTTON}
        dismissButton={DISMISS_BUTTON}
        message={
          <div>
            Are you sure you want to delete this project? <br /> It will delete
            all the resources, templates, and plugins in the project.
          </div>
        }
        onConfirm={handleConfirmDelete}
        onDismiss={handleDismissDelete}
      />

      <div>
        <Button
          buttonStyle={EnumButtonStyle.Primary}
          buttonState={EnumButtonState.Danger}
          icon="trash_2"
          onClick={handleDelete}
        >
          {"Delete"}
        </Button>
      </div>
      <Snackbar
        open={Boolean(error)}
        message={errorMessage}
        onClose={clearError}
      />
    </>
  );
};

const DELETE_PROJECT = gql`
  mutation deleteProject($projectId: String!) {
    deleteProject(where: { id: $projectId }) {
      id
    }
  }
`;
