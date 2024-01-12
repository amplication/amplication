import { ConfirmationDialog, Snackbar } from "@amplication/ui/design-system";
import { useCallback, useState } from "react";
import { Button, EnumButtonStyle } from "../Components/Button";
import useModuleDto from "../ModuleDto/hooks/useModuleDto";
import * as models from "../models";
import { formatError } from "../util/error";

const CONFIRM_BUTTON = { label: "Delete" };
const DISMISS_BUTTON = { label: "Dismiss" };

type Props = {
  moduleDto: models.ModuleDto;
  moduleDtoProperty: models.ModuleDtoProperty;
  onPropertyDelete?: (property: models.ModuleDtoProperty) => void;
};

export const DeleteModuleDtoProperty = ({
  moduleDto,
  moduleDtoProperty,
  onPropertyDelete,
}: Props) => {
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

  const { deleteModuleDtoProperty, deleteModuleDtoPropertyError } =
    useModuleDto();

  const hasError = Boolean(deleteModuleDtoPropertyError);
  const errorMessage = formatError(deleteModuleDtoPropertyError);

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
    deleteModuleDtoProperty({
      variables: {
        where: {
          moduleDto: {
            id: moduleDto.id,
          },
          propertyName: moduleDtoProperty.name,
        },
      },
    })
      .catch(console.error)
      .then(() => {
        if (onPropertyDelete) {
          onPropertyDelete(moduleDtoProperty);
        }
      });
  }, [deleteModuleDtoProperty, moduleDtoProperty, onPropertyDelete, moduleDto]);

  return (
    <>
      <ConfirmationDialog
        isOpen={confirmDelete}
        title={`Delete '${moduleDtoProperty.name}' ?`}
        confirmButton={CONFIRM_BUTTON}
        dismissButton={DISMISS_BUTTON}
        message={<div>Are you sure you want to delete this property?</div>}
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
