import React, { useCallback, useState, useContext } from "react";
import { gql, useMutation, Reference, useQuery } from "@apollo/client";
import * as models from "../models";
import { ConfirmationDialog } from "@amplication/ui/design-system";
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
  const { dataType, properties } = entityField;
  const { relatedFieldId, relatedEntityId } = properties;
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const { addEntity } = useContext(AppContext);
  const { data: relatedFieldData } = useQuery(GET_ENTITY_WITH_SPECIFIC_FIELD, {
    variables: {
      entityId: relatedEntityId,
      fieldId: relatedFieldId,
    },
    skip: dataType !== models.EnumDataType.Lookup,
  });

  const [deleteEntityField, { loading: deleteLoading }] = useMutation<DType>(
    DELETE_ENTITY_FIELD,
    {
      update(cache, { data }) {
        if (!data) return;
        const deletedFieldId = data.deleteEntityField.id;

        if (entityField.dataType === models.EnumDataType.Lookup) {
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
        title={`Delete '${entityField.displayName}'`}
        confirmButton={CONFIRM_BUTTON}
        dismissButton={DISMISS_BUTTON}
        message={
          <span>
            Are you sure you want to delete this entity field?
            <br />
            {dataType === models.EnumDataType.Lookup &&
              `This will also delete the related field (${relatedFieldData?.entity?.fields[0]?.displayName}) of entity '${relatedFieldData?.entity?.displayName}'`}
          </span>
        }
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

const GET_ENTITY_WITH_SPECIFIC_FIELD = gql`
  query entity($entityId: String!, $fieldId: String!) {
    entity(where: { id: $entityId }) {
      id
      name
      displayName
      pluralDisplayName
      customAttributes
      fields(where: { permanentId: { equals: $fieldId } }) {
        id
        createdAt
        updatedAt
        name
        displayName
        dataType
        properties
        required
        unique
        searchable
        customAttributes
        description
      }
    }
  }
`;
