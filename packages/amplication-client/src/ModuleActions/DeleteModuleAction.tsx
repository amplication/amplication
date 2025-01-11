import { ConfirmationDialog, Snackbar } from "@amplication/ui/design-system";
import { useCallback, useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, EnumButtonStyle } from "../Components/Button";
import * as models from "../models";
import { formatError } from "../util/error";
import { useResourceBaseUrl } from "../util/useResourceBaseUrl";
import useModuleAction from "./hooks/useModuleAction";

const CONFIRM_BUTTON = { label: "Delete" };
const DISMISS_BUTTON = { label: "Dismiss" };

type Props = {
  moduleAction: models.ModuleAction;
};

export const DeleteModuleAction = ({ moduleAction }: Props) => {
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

  const history = useHistory();
  const { baseUrl } = useResourceBaseUrl();

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
        history.push(`${baseUrl}/modules`);
      })
      .catch(console.error);
  }, [deleteModuleAction, moduleAction, baseUrl, history]);

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
