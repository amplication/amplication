import React, { useCallback, useState } from "react";
import { gql, useMutation, Reference } from "@apollo/client";
import { isEmpty } from "lodash";
import * as models from "../models";
import {
  Panel,
  ConfirmationDialog,
  EnumPanelStyle,
} from "@amplication/design-system";
import { Link, useHistory } from "react-router-dom";
import { Icon } from "@rmwc/icon";
import { Button, EnumButtonStyle } from "../Components/Button";
import { DATA_TYPE_TO_LABEL_AND_ICON, SYSTEM_DATA_TYPES } from "./constants";
import "./EntityFieldListItem.scss";

const CONFIRM_BUTTON = { icon: "trash_2", label: "Delete" };
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

const CLASS_NAME = "entity-field-list-item";

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

  const handleRowClick = useCallback(() => {
    history.push(
      `/${applicationId}/entities/${entity.id}/fields/${entityField.id}`
    );
  }, [history, applicationId, entityField, entity]);

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

      <Panel
        className={CLASS_NAME}
        clickable
        onClick={handleRowClick}
        panelStyle={EnumPanelStyle.Bordered}
      >
        <div className={`${CLASS_NAME}__row`}>
          <Link
            className={`${CLASS_NAME}__title`}
            title={entityField.displayName}
            to={fieldUrl}
          >
            {entityField.displayName}
          </Link>
          <span className={`${CLASS_NAME}__description`}>
            {entityField.name}
          </span>
          <span className="spacer" />
        </div>
        {!isEmpty(entityField.description) && (
          <div className={`${CLASS_NAME}__row`}>
            <span className={`${CLASS_NAME}__description`}>
              {entityField.description}
            </span>
          </div>
        )}
        <div className={`${CLASS_NAME}__row`}>
          <span className={`${CLASS_NAME}__highlight`}>
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
          </span>
          {entityField.required && (
            <span className={`${CLASS_NAME}__property`}>
              <Icon icon="check" />
              Required
            </span>
          )}
          {entityField.searchable && (
            <span className={`${CLASS_NAME}__property`}>
              <Icon icon="check" />
              Searchable
            </span>
          )}
          <span className="spacer" />
          {!deleteLoading && !SYSTEM_DATA_TYPES.has(entityField.dataType) && (
            <Button
              buttonStyle={EnumButtonStyle.Clear}
              icon="trash_2"
              onClick={handleDelete}
            />
          )}
        </div>
      </Panel>
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
