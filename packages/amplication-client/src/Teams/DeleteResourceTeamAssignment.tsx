import { ConfirmationDialog } from "@amplication/ui/design-system";
import { useCallback, useState } from "react";
import { Button, EnumButtonStyle } from "../Components/Button";
import * as models from "../models";

const CONFIRM_BUTTON = { label: "Remove" };
const DISMISS_BUTTON = { label: "Dismiss" };

type Props = {
  teamAssignment: models.TeamAssignment;
  onDelete: (teamAssignment: models.TeamAssignment) => void;
};

export const DeleteResourceTeamAssignment = ({
  teamAssignment,
  onDelete,
}: Props) => {
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

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
    onDelete(teamAssignment);
  }, [onDelete, teamAssignment]);

  return (
    <>
      <ConfirmationDialog
        isOpen={confirmDelete}
        title={`Remove '${teamAssignment.team.name}' ?`}
        confirmButton={CONFIRM_BUTTON}
        dismissButton={DISMISS_BUTTON}
        message={
          <div>
            Removing this team will permanently remove all its role assignments.
            This action cannot be undone.
          </div>
        }
        onConfirm={handleConfirmDelete}
        onDismiss={handleDismissDelete}
      />

      <Button
        buttonStyle={EnumButtonStyle.Text}
        icon="trash_2"
        onClick={handleDelete}
        type="button"
      ></Button>
    </>
  );
};
