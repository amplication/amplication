import { ConfirmationDialog, Snackbar } from "@amplication/ui/design-system";
import { useCallback, useState } from "react";
import { Button, EnumButtonStyle } from "../../Components/Button";
import useCustomProperties from "../hooks/useCustomProperties";
import * as models from "../../models";
import { formatError } from "../../util/error";

const CONFIRM_BUTTON = { label: "Delete" };
const DISMISS_BUTTON = { label: "Dismiss" };

type Props = {
  customProperty: models.CustomProperty;
  customPropertyOption: models.CustomPropertyOption;
  onOptionDelete?: (option: models.CustomPropertyOption) => void;
  disabled?: boolean;
};

export const DeleteCustomPropertyOption = ({
  customProperty,
  customPropertyOption,
  onOptionDelete,
  disabled,
}: Props) => {
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

  const { deleteCustomPropertyOption, deleteCustomPropertyOptionError } =
    useCustomProperties();

  const hasError = Boolean(deleteCustomPropertyOptionError);
  const errorMessage = formatError(deleteCustomPropertyOptionError);

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
    deleteCustomPropertyOption({
      variables: {
        where: {
          customProperty: {
            id: customProperty.id,
          },
          value: customPropertyOption.value,
        },
      },
    })
      .catch(console.error)
      .then(() => {
        if (onOptionDelete) {
          onOptionDelete(customPropertyOption);
        }
      });
  }, [
    deleteCustomPropertyOption,
    customPropertyOption,
    onOptionDelete,
    customProperty,
  ]);

  return (
    <>
      <ConfirmationDialog
        isOpen={confirmDelete}
        title={`Delete '${customPropertyOption.value}' ?`}
        confirmButton={CONFIRM_BUTTON}
        dismissButton={DISMISS_BUTTON}
        message={<div>Are you sure you want to delete this option?</div>}
        onConfirm={handleConfirmDelete}
        onDismiss={handleDismissDelete}
      />

      <Button
        buttonStyle={EnumButtonStyle.Text}
        icon="trash_2"
        onClick={handleDelete}
        type="button"
        disabled={disabled}
      ></Button>
      <Snackbar open={hasError} message={errorMessage} />
    </>
  );
};
