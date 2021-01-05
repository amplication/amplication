import React, { useCallback, useContext, useState } from "react";
import { gql, useMutation, Reference } from "@apollo/client";
import * as models from "../models";
import {
  DataGridRow,
  DataGridCell,
  ConfirmationDialog,
  UserAndTime,
} from "@amplication/design-system";
import { Link, useHistory } from "react-router-dom";

import LockStatusIcon from "../VersionControl/LockStatusIcon";
import { Button, EnumButtonStyle } from "../Components/Button";

import PendingChangesContext from "../VersionControl/PendingChangesContext";
import { USER_ENTITY } from "./constants";

const CONFIRM_BUTTON = { icon: "trash_2", label: "Delete" };
const DISMISS_BUTTON = { label: "Dismiss" };

type DType = {
  deleteEntity: { id: string };
};

type Props = {
  applicationId: string;
  entity: models.Entity;
  onDelete?: () => void;
  onError: (error: Error) => void;
};

export const EntityListItem = ({
  entity,
  applicationId,
  onDelete,
  onError,
}: Props) => {
  const pendingChangesContext = useContext(PendingChangesContext);
  const history = useHistory();

  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

  const [deleteEntity, { loading: deleteLoading }] = useMutation<DType>(
    DELETE_ENTITY,
    {
      update(cache, { data }) {
        if (!data) return;
        const deletedEntityId = data.deleteEntity.id;

        cache.modify({
          fields: {
            entities(existingEntityRefs, { readField }) {
              return existingEntityRefs.filter(
                (entityRef: Reference) =>
                  deletedEntityId !== readField("id", entityRef)
              );
            },
          },
        });
      },
      onCompleted: (data) => {
        pendingChangesContext.addEntity(data.deleteEntity.id);
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
    deleteEntity({
      variables: {
        entityId: entity.id,
      },
    }).catch(onError);
  }, [entity, deleteEntity, onError]);

  const handleRowClick = useCallback(() => {
    history.push(`/${applicationId}/entities/${entity.id}`);
  }, [history, applicationId, entity]);

  const [latestVersion] = entity.versions;

  return (
    <>
      <ConfirmationDialog
        isOpen={confirmDelete}
        title={`Delete ${entity.displayName}`}
        confirmButton={CONFIRM_BUTTON}
        dismissButton={DISMISS_BUTTON}
        message="Are you sure you want to delete this entity?"
        onConfirm={handleConfirmDelete}
        onDismiss={handleDismissDelete}
      />
      <DataGridRow onClick={handleRowClick}>
        <DataGridCell className="min-width">
          {Boolean(entity.lockedByUser) && <LockStatusIcon enabled />}
        </DataGridCell>
        <DataGridCell>
          <Link
            className="amp-data-grid-item--navigate"
            title={entity.displayName}
            to={`/${applicationId}/entities/${entity.id}`}
          >
            <span className="text-medium">{entity.displayName}</span>
          </Link>
        </DataGridCell>
        <DataGridCell>{entity.description}</DataGridCell>
        <DataGridCell>
          {latestVersion.commit && (
            <UserAndTime
              account={latestVersion.commit.user?.account}
              time={latestVersion.commit.createdAt}
            />
          )}
          <span className="text-medium space-before">
            {latestVersion.commit?.message}{" "}
          </span>
        </DataGridCell>
        <DataGridCell alignEnd>
          {!deleteLoading && entity.name !== USER_ENTITY && (
            <Button
              buttonStyle={EnumButtonStyle.Clear}
              icon="trash_2"
              onClick={handleDelete}
            />
          )}
        </DataGridCell>
      </DataGridRow>
    </>
  );
};

const DELETE_ENTITY = gql`
  mutation deleteEntity($entityId: String!) {
    deleteEntity(where: { id: $entityId }) {
      id
    }
  }
`;
