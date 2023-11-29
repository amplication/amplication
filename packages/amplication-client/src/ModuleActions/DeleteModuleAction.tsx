import React, { useCallback, useState } from "react";
import * as models from "../models";
import { ConfirmationDialog, Snackbar } from "@amplication/ui/design-system";
import { Button, EnumButtonStyle } from "../Components/Button";
import useModuleAction from "./hooks/useModuleAction";
import { formatError } from "../util/error";

const CONFIRM_BUTTON = { label: "Delete" };
const DISMISS_BUTTON = { label: "Dismiss" };

type Props = {
  moduleAction: models.ModuleAction;
};

export const DeleteModuleAction = ({ moduleAction }: Props) => {
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

  const { deleteCurrentModuleAction, deleteModuleActionError } =
    useModuleAction();

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
    deleteCurrentModuleAction(moduleAction);
  }, [deleteCurrentModuleAction, moduleAction]);

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
