import React, { useCallback, useState } from "react";
import * as models from "../models";
import { ConfirmationDialog, Snackbar } from "@amplication/ui/design-system";
import { Button, EnumButtonStyle } from "../Components/Button";
import useCustomProperties from "./hooks/useCustomProperties";
import { formatError } from "../util/error";
import { useAppContext } from "../context/appContext";

const CONFIRM_BUTTON = { label: "Delete" };
const DISMISS_BUTTON = { label: "Dismiss" };

type Props = {
  customProperty: models.CustomProperty;
  onDelete?: () => void;
  showLabel: boolean;
};

const CLASS_NAME = "delete-custom-property";

export const DeleteCustomProperty = ({
  customProperty,
  onDelete,
  showLabel,
}: Props) => {
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

  const { permissions } = useAppContext();
  const { deleteCustomProperty, deleteCustomPropertyError } =
    useCustomProperties();

  const hasError = Boolean(deleteCustomPropertyError);
  const errorMessage = formatError(deleteCustomPropertyError);

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

    deleteCustomProperty({
      variables: {
        where: {
          id: customProperty.id,
        },
      },
    })
      .then(onDelete)
      .catch(console.error);
  }, [deleteCustomProperty, customProperty, onDelete]);

  return (
    <>
      <ConfirmationDialog
        isOpen={confirmDelete}
        title={`Delete '${customProperty.name}' ?`}
        confirmButton={CONFIRM_BUTTON}
        dismissButton={DISMISS_BUTTON}
        message={<div>Are you sure you want to delete this property?</div>}
        onConfirm={handleConfirmDelete}
        onDismiss={handleDismissDelete}
      />

      <div className={CLASS_NAME}>
        <Button
          disabled={!permissions.allowedTasks["property.delete"]}
          buttonStyle={EnumButtonStyle.Text}
          icon="trash_2"
          onClick={handleDelete}
        >
          {showLabel && "Delete"}
        </Button>
      </div>
      <Snackbar open={hasError} message={errorMessage} />
    </>
  );
};
