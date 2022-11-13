import React, { useCallback, useState, useContext } from "react";
import { gql, useMutation, Reference } from "@apollo/client";
import * as models from "../models";
import { ConfirmationDialog } from "@amplication/design-system";
import { Button, EnumButtonStyle } from "../Components/Button";
import { SYSTEM_DATA_TYPES } from "./constants";
import { AppContext } from "../context/appContext";

const CONFIRM_BUTTON = { icon: "trash_2", label: "Delete" };
const DISMISS_BUTTON = { label: "Dismiss" };

type DType = {
  deleteEntityField: { id: string };
};

type Props = {
  entityId: string;
  entityField: models.EntityField;
  showLabel?: boolean;
  onDelete?: () => void;
  onError: (error: Error) => void;
};

const CLASS_NAME = "delete-entity-field";

export const DeleteEntityField = ({
  entityField,
  entityId,
  showLabel = false,
  onDelete,
  onError,
}: Props) => {
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const { addEntity, } = useContext(AppContext);

  const [deleteEntityField, { loading: deleteLoading }] = useMutation<DType>(
    DELETE_ENTITY_FIELD,
    {
      update(cache, { data }) {
        if (!data) return;
        const deletedFieldId = data.deleteEntityField.id;

        if (entityField.dataType === models.EnumDataType.Lookup) {
          const relatedEntityId = entityField.properties.relatedEntityId;
          cache.evict({
            id: cache.identify({ id: relatedEntityId, __typename: "Entity" }),
          });
        }

        cache.modify({
          id: cache.identify({ id: entityId, __typename: "Entity" }),
          fields: {
            fields(existingFieldsRefs, { readField }) {
              return existingFieldsRefs.filter(
                (fieldRef: Reference) =>
                  deletedFieldId !== readField("id", fieldRef)
              );
            },
          },
        });
      },
      onCompleted: (data) => {
        addEntity(entityId);
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
    deleteEntityField({
      variables: {
        entityFieldId: entityField.id,
      },
    }).catch(onError);
  }, [entityField, deleteEntityField, onError]);

  return (
    <>
      <ConfirmationDialog
        isOpen={confirmDelete}
        title={`Delete ${entityField.displayName}`}
        confirmButton={CONFIRM_BUTTON}
        dismissButton={DISMISS_BUTTON}
        message="Are you sure you want to delete this entity field?"
        onConfirm={handleConfirmDelete}
        onDismiss={handleDismissDelete}
      />

      <div className={CLASS_NAME}>
        {!deleteLoading && !SYSTEM_DATA_TYPES.has(entityField.dataType) && (
          <Button
            buttonStyle={
              showLabel ? EnumButtonStyle.Clear : EnumButtonStyle.Text
            }
            icon="trash_2"
            onClick={handleDelete}
          >
            {showLabel && "Delete"}
          </Button>
        )}
      </div>
    </>
  );
};

const DELETE_ENTITY_FIELD = gql`
  mutation deleteEntityField($entityFieldId: String!) {
    deleteEntityField(where: { id: $entityFieldId }) {
      id
    }
  }
`;
