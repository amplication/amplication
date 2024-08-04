import React, { useCallback, useState } from "react";
import * as models from "../models";
import { ConfirmationDialog, Snackbar } from "@amplication/ui/design-system";
import { Button, EnumButtonStyle } from "../Components/Button";
import usePrivatePlugin from "./hooks/usePrivatePlugin";
import { formatError } from "../util/error";

const CONFIRM_BUTTON = { label: "Delete" };
const DISMISS_BUTTON = { label: "Dismiss" };

type Props = {
  privatePlugin: models.PrivatePlugin;
  onDelete?: () => void;
};

const CLASS_NAME = "delete-private-plugin";

export const DeletePrivatePlugin = ({ privatePlugin, onDelete }: Props) => {
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

  const { deletePrivatePlugin, deletePrivatePluginError } = usePrivatePlugin(
    privatePlugin.id
  );
  const hasError = Boolean(deletePrivatePluginError);
  const errorMessage = formatError(deletePrivatePluginError);

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

    deletePrivatePlugin({
      variables: {
        where: {
          id: privatePlugin.id,
        },
      },
    })
      .catch()
      .then(() => {
        if (onDelete) {
          onDelete();
        }
      });
  }, [deletePrivatePlugin, onDelete, privatePlugin.id]);

  return (
    <>
      <ConfirmationDialog
        isOpen={confirmDelete}
        title={`Delete '${privatePlugin.displayName}' ?`}
        confirmButton={CONFIRM_BUTTON}
        dismissButton={DISMISS_BUTTON}
        message={
          <div>Are you sure you want to delete this private plugin?</div>
        }
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
