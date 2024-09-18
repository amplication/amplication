import { ConfirmationDialog, Snackbar } from "@amplication/ui/design-system";
import { useCallback, useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, EnumButtonStyle } from "../Components/Button";
import * as models from "../models";
import { formatError } from "../util/error";
import { useResourceBaseUrl } from "../util/useResourceBaseUrl";
import useModuleDto from "./hooks/useModuleDto";

const CONFIRM_BUTTON = { label: "Delete" };
const DISMISS_BUTTON = { label: "Dismiss" };

type Props = {
  moduleDto: models.ModuleDto;
};

export const DeleteModuleDto = ({ moduleDto }: Props) => {
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

  const history = useHistory();
  const { baseUrl } = useResourceBaseUrl();

  const { deleteModuleDto, deleteModuleDtoError } = useModuleDto();

  const hasError = Boolean(deleteModuleDtoError);
  const errorMessage = formatError(deleteModuleDtoError);

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
    deleteModuleDto({
      variables: {
        where: {
          id: moduleDto.id,
        },
      },
    })
      .then((result) => {
        history.push(`${baseUrl}/modules/${moduleDto.parentBlockId}/dtos`);
      })
      .catch(console.error);
  }, [deleteModuleDto, moduleDto, baseUrl, history]);

  return (
    <>
      <ConfirmationDialog
        isOpen={confirmDelete}
        title={`Delete '${moduleDto.displayName}' ?`}
        confirmButton={CONFIRM_BUTTON}
        dismissButton={DISMISS_BUTTON}
        message={<div>Are you sure you want to delete this dto?</div>}
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
