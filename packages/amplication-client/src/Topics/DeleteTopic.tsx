import React, { useCallback, useState } from "react";
import * as models from "../models";
import { ConfirmationDialog, Snackbar } from "@amplication/ui/design-system";
import { Button, EnumButtonStyle } from "../Components/Button";
import useTopic from "./hooks/useTopic";
import { formatError } from "../util/error";

const CONFIRM_BUTTON = { label: "Delete" };
const DISMISS_BUTTON = { label: "Dismiss" };

type Props = {
  topic: models.Topic;
  onDelete?: () => void;
};

const CLASS_NAME = "delete-topic";

export const DeleteTopic = ({ topic, onDelete }: Props) => {
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

  const { deleteTopic, deleteTopicError } = useTopic(topic.id);
  const hasError = Boolean(deleteTopicError);
  const errorMessage = formatError(deleteTopicError);

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
    }).catch();
  }, [deleteTopic, topic]);

  return (
    <>
      <ConfirmationDialog
        isOpen={confirmDelete}
        title={`Delete '${topic.displayName}' ?`}
        confirmButton={CONFIRM_BUTTON}
        dismissButton={DISMISS_BUTTON}
        message={<div>Are you sure you want to delete this topic?</div>}
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
      <Snackbar open={hasError} message={errorMessage} />
    </>
  );
};
