import { ConfirmationDialog, Snackbar } from "@amplication/ui/design-system";
import { useCallback, useState } from "react";
import { Button, EnumButtonStyle } from "../Components/Button";
import * as models from "../models";
import { formatError } from "../util/error";
import useModuleDtoEnumMember from "./hooks/useModuleDtoEnumMember";

const CONFIRM_BUTTON = { label: "Delete" };
const DISMISS_BUTTON = { label: "Dismiss" };

type Props = {
  moduleDto: models.ModuleDto;
  moduleDtoEnumMember: models.ModuleDtoEnumMember;
  onEnumMemberDelete?: (enumMember: models.ModuleDtoEnumMember) => void;
};

export const DeleteModuleDtoEnumMember = ({
  moduleDto,
  moduleDtoEnumMember,
  onEnumMemberDelete,
}: Props) => {
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

  const { deleteModuleDtoEnumMember, deleteModuleDtoEnumMemberError } =
    useModuleDtoEnumMember();

  const hasError = Boolean(deleteModuleDtoEnumMemberError);
  const errorMessage = formatError(deleteModuleDtoEnumMemberError);

  const handleDelete = useCallback(
    (event) => {
      event.stopPropagation();
      event.preventDefault();
      setConfirmDelete(true);
    },
    [setConfirmDelete]
  );

  const handleDismissDelete = useCallback(() => {
    setConfirmDelete(false);
  }, [setConfirmDelete]);

  const handleConfirmDelete = useCallback(() => {
    setConfirmDelete(false);
    deleteModuleDtoEnumMember({
      variables: {
        where: {
          moduleDto: {
            id: moduleDto.id,
          },
          enumMemberName: moduleDtoEnumMember.name,
        },
      },
    })
      .catch(console.error)
      .then(() => {
        if (onEnumMemberDelete) {
          onEnumMemberDelete(moduleDtoEnumMember);
        }
      });
  }, [
    deleteModuleDtoEnumMember,
    moduleDtoEnumMember,
    onEnumMemberDelete,
    moduleDto,
  ]);

  return (
    <>
      <ConfirmationDialog
        isOpen={confirmDelete}
        title={`Delete '${moduleDtoEnumMember.name}' ?`}
        confirmButton={CONFIRM_BUTTON}
        dismissButton={DISMISS_BUTTON}
        message={<div>Are you sure you want to delete this Enum member?</div>}
        onConfirm={handleConfirmDelete}
        onDismiss={handleDismissDelete}
      />

      <Button
        buttonStyle={EnumButtonStyle.Text}
        icon="trash_2"
        onClick={handleDelete}
        type="button"
      ></Button>
      <Snackbar open={hasError} message={errorMessage} />
    </>
  );
};
