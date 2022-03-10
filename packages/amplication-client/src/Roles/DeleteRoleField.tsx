import React, { useState, useCallback } from "react";
import { gql, useMutation } from "@apollo/client";
import { Button, EnumButtonStyle } from "../Components/Button";
import { ConfirmationDialog } from "@amplication/design-system";
import * as models from "../models";

type Props = {
  appRole?: models.AppRole;
  onError: (error: Error) => void;
  onDelete?: () => void;
  showLabel?: boolean;
};

type DType = {
  deleteAppRole: { id: string };
};

const CONFIRM_BUTTON = { icon: "trash_2", label: "Delete" };
const DISMISS_BUTTON = { label: "Dismiss" };

const DeleteRoleField = ({
  appRole,
  onError,
  onDelete,
  showLabel = false,
}: Props) => {
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const [deleteAppRole, { loading: deleteLoading }] = useMutation<DType>(
    DELETE_APP_ROLE,
    { refetchQueries: ["getRoles"], onCompleted: onDelete },
  );

  const handleDelete = useCallback(() => {
    setConfirmDelete(true);
  }, [setConfirmDelete]);

  const handleDismissDelete = useCallback(() => {
    setConfirmDelete(false);
  }, [setConfirmDelete]);

  const handleConfirmDelete = useCallback(() => {
    setConfirmDelete(false);
    deleteAppRole({
      variables: {
        appRoleId: appRole?.id,
      },
    }).catch(onError);
  }, [appRole, deleteAppRole, onError]);

  return (
    <div>
      <ConfirmationDialog
        isOpen={confirmDelete}
        title={`Delete ${appRole?.displayName}`}
        confirmButton={CONFIRM_BUTTON}
        dismissButton={DISMISS_BUTTON}
        message="Are you sure you want to delete this role field?"
        onConfirm={handleConfirmDelete}
        onDismiss={handleDismissDelete}
      />
      {!deleteLoading && (
        <Button
          buttonStyle={
            showLabel ? EnumButtonStyle.Secondary : EnumButtonStyle.Clear
          }
          icon="trash_2"
          onClick={handleDelete}>
          {showLabel && "Delete"}
        </Button>
      )}
    </div>
  );
};

export default DeleteRoleField;

const DELETE_APP_ROLE = gql`
  mutation deleteAppRole($appRoleId: String!) {
    deleteAppRole(where: { id: $appRoleId }) {
      id
    }
  }
`;
