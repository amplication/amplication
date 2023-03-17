import { ConfirmationDialog } from "@amplication/ui/design-system";
import { gql, useMutation } from "@apollo/client";
import React, { useCallback, useState } from "react";
import { Button, EnumButtonStyle } from "../Components/Button";
import * as models from "../models";
import { GET_API_TOKENS } from "./ApiTokenList";

const CONFIRM_BUTTON = { icon: "trash_2", label: "Delete" };
const DISMISS_BUTTON = { label: "Dismiss" };

type DType = {
  deleteApiToken: { id: string };
};

type Props = {
  apiToken: models.ApiToken;
  onDelete?: () => void;
  onError: (error: Error) => void;
};

const CLASS_NAME = "delete-api-token";

export const DeleteApiToken = ({ apiToken, onDelete, onError }: Props) => {
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

  const [deleteApiToken, { loading: deleteLoading }] = useMutation<DType>(
    DELETE_API_TOKEN,
    {
      refetchQueries: [{ query: GET_API_TOKENS }],
      onCompleted: (data) => {
        onDelete && onDelete();
      },
    }
  );

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
    deleteApiToken({
      variables: {
        apiTokenId: apiToken.id,
      },
    }).catch(onError);
  }, [apiToken, deleteApiToken, onError]);

  return (
    <>
      <ConfirmationDialog
        isOpen={confirmDelete}
        title={`Delete ${apiToken.name}`}
        confirmButton={CONFIRM_BUTTON}
        dismissButton={DISMISS_BUTTON}
        message="This API token will stop working immediately. Are you sure you want to delete this token?"
        onConfirm={handleConfirmDelete}
        onDismiss={handleDismissDelete}
      />

      <div className={CLASS_NAME}>
        {!deleteLoading && (
          <Button
            buttonStyle={EnumButtonStyle.Text}
            icon="trash_2"
            onClick={handleDelete}
          />
        )}
      </div>
    </>
  );
};

const DELETE_API_TOKEN = gql`
  mutation deleteApiToken($apiTokenId: String!) {
    deleteApiToken(where: { id: $apiTokenId }) {
      id
    }
  }
`;
