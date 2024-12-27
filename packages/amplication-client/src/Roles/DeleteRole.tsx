import React, { useCallback, useState } from "react";
import * as models from "../models";
import { ConfirmationDialog, Snackbar } from "@amplication/ui/design-system";
import { Button, EnumButtonStyle } from "../Components/Button";
import useRoles from "./hooks/useRoles";
import { formatError } from "../util/error";

const CONFIRM_BUTTON = { label: "Delete" };
const DISMISS_BUTTON = { label: "Dismiss" };

type Props = {
  role: models.Role;
  onDelete?: () => void;
};

const CLASS_NAME = "delete-role";

export const DeleteRole = ({ role, onDelete }: Props) => {
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

  const { deleteRole, deleteRoleError } = useRoles();

  const hasError = Boolean(deleteRoleError);
  const errorMessage = formatError(deleteRoleError);

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

    deleteRole({
      variables: {
        where: {
          id: role.id,
        },
      },
    })
      .then(onDelete)
      .catch(console.error);
  }, [deleteRole, role, onDelete]);

  return (
    <>
      <ConfirmationDialog
        isOpen={confirmDelete}
        title={`Delete '${role.name}' ?`}
        confirmButton={CONFIRM_BUTTON}
        dismissButton={DISMISS_BUTTON}
        message={<div>Are you sure you want to delete this role?</div>}
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
