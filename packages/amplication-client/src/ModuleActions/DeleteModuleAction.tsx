import React, { useCallback, useContext, useState } from "react";
import * as models from "../models";
import { ConfirmationDialog, Snackbar } from "@amplication/ui/design-system";
import { Button, EnumButtonStyle } from "../Components/Button";
import useModuleAction from "./hooks/useModuleAction";
import { formatError } from "../util/error";
import { AppContext } from "../context/appContext";
import { useHistory } from "react-router-dom";
import { useOnboardingChecklistContext } from "../OnboardingChecklist/context/OnboardingChecklistContext";

const CONFIRM_BUTTON = { label: "Delete" };
const DISMISS_BUTTON = { label: "Dismiss" };

type Props = {
  moduleAction: models.ModuleAction;
};

export const DeleteModuleAction = ({ moduleAction }: Props) => {
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const { currentWorkspace, currentProject, currentResource } =
    useContext(AppContext);
  const history = useHistory();
  const { setOnboardingProps } = useOnboardingChecklistContext();

  const { deleteModuleAction, deleteModuleActionError } = useModuleAction();

  const hasError = Boolean(deleteModuleActionError);
  const errorMessage = formatError(deleteModuleActionError);

  const handleDelete = useCallback(
    (event) => {
      event.stopPropagation();
      setConfirmDelete(true);
    },
    [setConfirmDelete]
  );

  const handleDismissDelete = useCallback(() => {
    setConfirmDelete(false);
  }, [setConfirmDelete]);

  const handleConfirmDelete = useCallback(() => {
    setConfirmDelete(false);
    deleteModuleAction({
      variables: {
        where: {
          id: moduleAction.id,
        },
      },
    })
      .then((result) => {
        history.push(
          `/${currentWorkspace?.id}/${currentProject?.id}/${currentResource?.id}/modules`
        );
        setOnboardingProps({
          apiUpdated: true,
        });
      })
      .catch(console.error);
  }, [
    deleteModuleAction,
    moduleAction,
    currentProject,
    currentResource,
    currentWorkspace,
    history,
    setOnboardingProps,
  ]);

  return (
    <>
      <ConfirmationDialog
        isOpen={confirmDelete}
        title={`Delete '${moduleAction.displayName}' ?`}
        confirmButton={CONFIRM_BUTTON}
        dismissButton={DISMISS_BUTTON}
        message={<div>Are you sure you want to delete this action?</div>}
        onConfirm={handleConfirmDelete}
        onDismiss={handleDismissDelete}
      />

      <Button
        buttonStyle={EnumButtonStyle.Text}
        icon="trash_2"
        onClick={handleDelete}
      >
        {"Delete"}
      </Button>
      <Snackbar open={hasError} message={errorMessage} />
    </>
  );
};
