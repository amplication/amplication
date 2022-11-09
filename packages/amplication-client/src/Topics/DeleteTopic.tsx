import React, { useCallback, useContext, useState } from "react";
import * as models from "../models";
import { ConfirmationDialog } from "@amplication/design-system";
import { Button, EnumButtonStyle } from "../Components/Button";
import { AppContext } from "../context/appContext";
import useServiceConnection from "../ServiceConnections/hooks/useServiceConnection";

const CONFIRM_BUTTON = { icon: "trash_2", label: "Delete" };
const DISMISS_BUTTON = { label: "Dismiss" };

type Props = {
  topic: models.Topic;
  onDelete?: () => void;
  onError: (error: Error) => void;
};

const CLASS_NAME = "delete-entity-field";

export const DeleteTopic = ({ topic, onDelete, onError }: Props) => {
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const { currentResource } = useContext(AppContext);

  const { deleteTopic } = useServiceConnection(currentResource?.id);

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

    deleteTopic({
      variables: {
        where: {
          id: topic.id,
        },
      },
    }).catch(onError);
  }, [deleteTopic, onError, topic]);

  return (
    <>
      <ConfirmationDialog
        isOpen={confirmDelete}
        title={`Delete ${topic.displayName}`}
        confirmButton={CONFIRM_BUTTON}
        dismissButton={DISMISS_BUTTON}
        message="Are you sure you want to delete this topic?"
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
    </>
  );
};
