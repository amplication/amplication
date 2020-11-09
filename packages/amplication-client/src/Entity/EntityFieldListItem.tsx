import React, { useCallback, useState } from "react";
import { gql, useMutation, Reference } from "@apollo/client";
import * as models from "../models";
import DataGridRow from "../Components/DataGridRow";
import { DataTableCell } from "@rmwc/data-table";
import { Link, useHistory } from "react-router-dom";
import "@rmwc/data-table/styles";
import { Icon } from "@rmwc/icon";

import CircleIcon from "../Components/CircleIcon";
import { Button, EnumButtonStyle } from "../Components/Button";
import { ConfirmationDialog } from "../Components/ConfirmationDialog";
import { DATA_TYPE_TO_LABEL_AND_ICON, SYSTEM_DATA_TYPES } from "./constants";

const CONFIRM_BUTTON = { icon: "delete_outline", label: "Delete" };
const DISMISS_BUTTON = { label: "Dismiss" };

type DType = {
  deleteEntityField: { id: string };
};

type Props = {
  applicationId: string;
  entity: models.Entity;
  entityField: models.EntityField;
  entityIdToName: Record<string, string> | null;
  onDelete?: () => void;
  onError: (error: Error) => void;
};

export const EntityFieldListItem = ({
  entityField,
  entity,
  applicationId,
  entityIdToName,
  onDelete,
  onError,
}: Props) => {
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

  const history = useHistory();

  const [deleteEntityField, { loading: deleteLoading }] = useMutation<DType>(
    DELETE_ENTITY_FIELD,
    {
      update(cache, { data }) {
        if (!data) return;
        const deletedFieldId = data.deleteEntityField.id;

        cache.modify({
          id: cache.identify(entity),
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

  const handleNavigateToRelatedEntity = useCallback(
    (event) => {
      event.stopPropagation();
      event.preventDefault();

      history.push(
        `/${applicationId}/entities/${entityField.properties.relatedEntityId}`
      );
    },
    [history, applicationId, entityField]
  );

  const handleConfirmDelete = useCallback(() => {
    setConfirmDelete(false);
    deleteEntityField({
      variables: {
        entityFieldId: entityField.id,
      },
    }).catch(onError);
  }, [entityField, deleteEntityField, onError]);

  const fieldUrl = `/${applicationId}/entities/${entity.id}/fields/${entityField.id}`;

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
      <DataGridRow navigateUrl={fieldUrl} key={entityField.id}>
        <DataTableCell>
          <Link
            className="amp-data-grid-item--navigate"
            title={entityField.displayName}
            to={fieldUrl}
          >
            <span className="text-medium">{entityField.displayName}</span>
          </Link>
        </DataTableCell>
        <DataTableCell>{entityField.name}</DataTableCell>
        <DataTableCell>
          <Icon
            className="amp-data-grid-item__icon"
            icon={{
              icon: DATA_TYPE_TO_LABEL_AND_ICON[entityField.dataType].icon,
              size: "xsmall",
            }}
          />

          {entityField.dataType === models.EnumDataType.Lookup &&
          entityIdToName ? (
            <Link
              className="amp-data-grid-item--link"
              title={DATA_TYPE_TO_LABEL_AND_ICON[entityField.dataType].label}
              to={`/${applicationId}/entities/${entityField.properties.relatedEntityId}`}
              onClick={handleNavigateToRelatedEntity}
            >
              {entityIdToName[entityField.properties.relatedEntityId]}{" "}
              <Icon icon="external_link" />
            </Link>
          ) : (
            DATA_TYPE_TO_LABEL_AND_ICON[entityField.dataType].label
          )}
        </DataTableCell>

        <DataTableCell alignMiddle>
          {entityField.required && <CircleIcon icon="check" />}
        </DataTableCell>
        <DataTableCell alignMiddle>
          {entityField.searchable && <CircleIcon icon="check" />}
        </DataTableCell>
        <DataTableCell>{entityField.description}</DataTableCell>
        <DataTableCell>
          {!deleteLoading && !SYSTEM_DATA_TYPES.has(entityField.dataType) && (
            <Button
              buttonStyle={EnumButtonStyle.Clear}
              icon="trash_2"
              onClick={handleDelete}
            />
          )}
        </DataTableCell>
      </DataGridRow>
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
