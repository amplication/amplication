import React, { useCallback, useState } from "react";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import * as models from "../models";
import DataGridRow from "../Components/DataGridRow";
import { DataTableCell } from "@rmwc/data-table";
import { Link } from "react-router-dom";
import "@rmwc/data-table/styles";

import { Icon } from "@rmwc/icon";
import CircleIcon from "../Components/CircleIcon";
import { Button, EnumButtonStyle } from "../Components/Button";

import { ConfirmationDialog } from "../Components/ConfirmationDialog";
import { DATA_TYPE_TO_LABEL_AND_ICON } from "./constants";

const CONFIRM_BUTTON = { icon: "delete_outline", label: "Delete" };
const DISMISS_BUTTON = { label: "Dismiss" };

type DType = {
  id: string;
};

type Props = {
  applicationId: string;
  entityId: string;
  entityField: models.EntityField;
  onDelete: () => void;
  onError: (error: Error) => void;
};

export const EntityFieldListItem = ({
  entityField,
  entityId,
  applicationId,
  onDelete,
  onError,
}: Props) => {
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

  const [deleteEntityField, { loading: deleteLoading }] = useMutation<DType>(
    DELETE_ENTITY_FIELD,
    {
      onCompleted: (data) => {
        onDelete();
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

  const fieldUrl = `/${applicationId}/entities/${entityId}/fields/${entityField.id}`;

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
          {DATA_TYPE_TO_LABEL_AND_ICON[entityField.dataType].label}
        </DataTableCell>

        <DataTableCell alignMiddle>
          {entityField.required && <CircleIcon icon="check" />}
        </DataTableCell>
        <DataTableCell alignMiddle>
          {entityField.searchable && <CircleIcon icon="check" />}
        </DataTableCell>
        <DataTableCell>{entityField.description}</DataTableCell>
        <DataTableCell>
          {!deleteLoading && (
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
