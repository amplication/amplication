import React, { useCallback, useState } from "react";
import * as models from "../../models";
import { ConfirmationDialog, Snackbar } from "@amplication/ui/design-system";
import { Button, EnumButtonStyle } from "../../Components/Button";
import { formatError } from "../../util/error";
import usePackage from "../hooks/usePackage";

const CONFIRM_BUTTON = { label: "Delete" };
const DISMISS_BUTTON = { label: "Dismiss" };

type Props = {
  packageItem: models.Package;
  onDelete?: () => void;
};

export const DeletePackage = ({ packageItem, onDelete }: Props) => {
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

  const { deletePackage, deletePackageError } = usePackage();

  const hasError = Boolean(deletePackageError);
  const errorMessage = formatError(deletePackageError);

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

    deletePackage({
      variables: {
        where: {
          id: packageItem.id,
        },
      },
    })
      .then(onDelete)
      .catch(console.error);
  }, [deletePackage, packageItem, onDelete]);

  return (
    <>
      <ConfirmationDialog
        isOpen={confirmDelete}
        title={`Delete '${packageItem.displayName}' ?`}
        confirmButton={CONFIRM_BUTTON}
        dismissButton={DISMISS_BUTTON}
        message={<div>Are you sure you want to delete this package?</div>}
        onConfirm={handleConfirmDelete}
        onDismiss={handleDismissDelete}
      />

      <div>
        <Button
          buttonStyle={EnumButtonStyle.Text}
          icon="trash_2"
          onClick={handleDelete}
        ></Button>
      </div>
      <Snackbar open={hasError} message={errorMessage} />
    </>
  );
};
