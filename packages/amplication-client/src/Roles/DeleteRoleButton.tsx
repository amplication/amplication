import { ConfirmationDialog } from "@amplication/design-system";
import { gql, Reference, useMutation } from "@apollo/client";
import React, { useCallback, useState } from "react";
import DeleteButton from "../Components/DeleteButton";

const CONFIRM_BUTTON = { icon: "trash_2", label: "Delete" };
const DISMISS_BUTTON = { label: "Dismiss" };

type Props = {
  displayName: string;
  resourceRoleId: string;
  onDelete: () => void;
};

type DType = {
  deleteResourceRole: { id: string };
};

export default function DeleteRoleButton({
  displayName,
  resourceRoleId,
  onDelete,
}: Props) {
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

  const handleDismissDelete = useCallback(() => {
    setConfirmDelete(false);
  }, [setConfirmDelete]);

  const [deleteResourceRole, { loading: deleteLoading }] = useMutation<DType>(
    DELETE_RESOURCE_ROLE,
    {
      update(cache, { data }) {
        if (!data) return;
        const deletedResourceRoleId = data.deleteResourceRole.id;

        cache.modify({
          fields: {
            resourceRoles(existingResourceRolesRefs, { readField }) {
              return existingResourceRolesRefs.filter(
                (resourceRoleRef: Reference) =>
                  deletedResourceRoleId !== readField("id", resourceRoleRef)
              );
            },
          },
        });
      },
      onCompleted: (data) => {
        onDelete();
      },
    }
  );

  const handleConfirmDelete = useCallback(() => {
    setConfirmDelete(false);
    deleteResourceRole({
      variables: {
        resourceRoleId: resourceRoleId,
      },
    });
  }, [resourceRoleId, deleteResourceRole]);

  const handleDelete = useCallback(
    (event) => {
      event.stopPropagation();
      setConfirmDelete(true);
    },
    [setConfirmDelete]
  );

  return (
    <>
      {!deleteLoading && (
        <>
          <DeleteButton showLabel onClick={handleDelete} />
          <ConfirmationDialog
            isOpen={confirmDelete}
            title={`Delete ${displayName}`}
            confirmButton={CONFIRM_BUTTON}
            dismissButton={DISMISS_BUTTON}
            message="Are you sure you want to delete this role?"
            onConfirm={handleConfirmDelete}
            onDismiss={handleDismissDelete}
          />
        </>
      )}
    </>
  );
}

const DELETE_RESOURCE_ROLE = gql`
  mutation deleteResourceRole($resourceRoleId: String!) {
    deleteResourceRole(where: { id: $resourceRoleId }) {
      id
    }
  }
`;
