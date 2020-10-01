import React, { useCallback, useContext, useState } from "react";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import * as models from "../models";
import DataGridRow from "../Components/DataGridRow";
import { DataTableCell } from "@rmwc/data-table";
import { Link } from "react-router-dom";
import "@rmwc/data-table/styles";

import LockStatusIcon from "../VersionControl/LockStatusIcon";
import UserAndTime from "../Components/UserAndTime";
import { Button, EnumButtonStyle } from "../Components/Button";
import { ConfirmationDialog } from "../Components/ConfirmationDialog";
import PendingChangesContext from "../VersionControl/PendingChangesContext";
import { USER_ENTITY } from "./constants";

const CONFIRM_BUTTON = { icon: "delete_outline", label: "Delete" };
const DISMISS_BUTTON = { label: "Dismiss" };

type DType = {
  id: string;
};

type Props = {
  applicationId: string;
  entity: models.Entity;
  onDelete: () => void;
  onError: (error: Error) => void;
};

export const EntityListItem = ({
  entity,
  applicationId,
  onDelete,
  onError,
}: Props) => {
  const pendingChangesContext = useContext(PendingChangesContext);

  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

  const [deleteEntity, { loading: deleteLoading }] = useMutation<DType>(
    DELETE_ENTITY,
    {
      onCompleted: (data) => {
        pendingChangesContext.addEntity(data.id);
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
    deleteEntity({
      variables: {
        entityId: entity.id,
      },
    }).catch(onError);
  }, [entity, deleteEntity, onError]);

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
      <DataGridRow navigateUrl={`/${applicationId}/entities/${entity.id}`}>
        <DataTableCell className="min-width">
          {Boolean(entity.lockedByUser) && <LockStatusIcon enabled />}
        </DataTableCell>
        <DataTableCell>
          <Link
            className="amp-data-grid-item--navigate"
            title={entity.displayName}
            to={`/${applicationId}/entities/${entity.id}`}
          >
            <span className="text-medium">{entity.displayName}</span>
          </Link>
        </DataTableCell>
        <DataTableCell>{entity.description}</DataTableCell>
        <DataTableCell>V{latestVersion.versionNumber}</DataTableCell>
        <DataTableCell>
          {latestVersion.commit && (
            <UserAndTime
              account={latestVersion.commit.user?.account}
              time={latestVersion.commit.createdAt}
            />
          )}
          <span className="text-medium space-before">
            {latestVersion.commit?.message}{" "}
          </span>
        </DataTableCell>
        <DataTableCell>
          {!deleteLoading && entity.name !== USER_ENTITY && (
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

const DELETE_ENTITY = gql`
  mutation deleteEntity($entityId: String!) {
    deleteEntity(where: { id: $entityId }) {
      id
    }
  }
`;
