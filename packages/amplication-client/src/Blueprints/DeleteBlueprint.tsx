import React, { useCallback, useState } from "react";
import * as models from "../models";
import { ConfirmationDialog, Snackbar } from "@amplication/ui/design-system";
import { Button, EnumButtonStyle } from "../Components/Button";
import useBlueprints from "./hooks/useBlueprints";
import { formatError } from "../util/error";

const CONFIRM_BUTTON = { label: "Delete" };
const DISMISS_BUTTON = { label: "Dismiss" };

type Props = {
  blueprint: models.Blueprint;
  onDelete?: () => void;
};

const CLASS_NAME = "delete-custom-property";

export const DeleteBlueprint = ({ blueprint, onDelete }: Props) => {
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

  const { deleteBlueprint, deleteBlueprintError } = useBlueprints();

  const hasError = Boolean(deleteBlueprintError);
  const errorMessage = formatError(deleteBlueprintError);

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

    deleteBlueprint({
      variables: {
        where: {
          id: blueprint.id,
        },
      },
    })
      .then(onDelete)
      .catch(console.error);
  }, [deleteBlueprint, blueprint, onDelete]);

  return (
    <>
      <ConfirmationDialog
        isOpen={confirmDelete}
        title={`Delete '${blueprint.name}' ?`}
        confirmButton={CONFIRM_BUTTON}
        dismissButton={DISMISS_BUTTON}
        message={<div>Are you sure you want to delete this property?</div>}
        onConfirm={handleConfirmDelete}
        onDismiss={handleDismissDelete}
      />

      <div className={CLASS_NAME}>
        <Button
          buttonStyle={EnumButtonStyle.Text}
          icon="trash_2"
          onClick={handleDelete}
        >
          {"Delete"}
        </Button>
      </div>
      <Snackbar open={hasError} message={errorMessage} />
    </>
  );
};
