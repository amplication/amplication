import { ConfirmationDialog, Snackbar } from "@amplication/ui/design-system";
import { useCallback, useState } from "react";
import { Button, EnumButtonStyle } from "../Components/Button";
import * as models from "../models";
import { formatError } from "../util/error";
import useBlueprints from "./hooks/useBlueprints";

const CONFIRM_BUTTON = { label: "Delete" };
const DISMISS_BUTTON = { label: "Dismiss" };

type Props = {
  blueprint: models.Blueprint;
  relation: models.BlueprintRelation;
  onDelete?: () => void;
};

const CLASS_NAME = "delete-team";

export const BlueprintRelationDelete = ({
  blueprint,
  relation,
  onDelete,
}: Props) => {
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

  const {
    deleteBlueprintRelation,
    deleteBlueprintRelationError,
    deleteBlueprintRelationLoading,
  } = useBlueprints(blueprint?.id);

  const hasError = Boolean(deleteBlueprintRelationError);
  const errorMessage = formatError(deleteBlueprintRelationError);

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

    deleteBlueprintRelation({
      variables: {
        where: {
          blueprint: {
            id: blueprint.id,
          },
          relationKey: relation.key,
        },
      },
    })
      .catch(console.error)
      .then((data) => {
        onDelete && onDelete();
      });
  }, [deleteBlueprintRelation, blueprint?.id, relation?.key, onDelete]);

  return (
    <>
      <ConfirmationDialog
        isOpen={confirmDelete}
        title={`Delete relation '${relation.name}' ?`}
        confirmButton={CONFIRM_BUTTON}
        dismissButton={DISMISS_BUTTON}
        message={
          <div>
            Deleting a relation will remove it from the blueprint but will not
            delete existing relations. Are you sure you want to delete this
            relation?
          </div>
        }
        onConfirm={handleConfirmDelete}
        onDismiss={handleDismissDelete}
      />

      <div className={CLASS_NAME}>
        <Button
          disabled={deleteBlueprintRelationLoading}
          buttonStyle={EnumButtonStyle.Text}
          icon="trash_2"
          onClick={handleDelete}
        ></Button>
      </div>
      <Snackbar open={hasError} message={errorMessage} />
    </>
  );
};
