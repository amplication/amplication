import React, { useCallback, useContext, useState } from "react";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import * as models from "../models";
import DataGridRow from "../Components/DataGridRow";
import { DataTableCell } from "@rmwc/data-table";
import { Link } from "react-router-dom";
import "@rmwc/data-table/styles";

import UserAvatar from "../Components/UserAvatar";
import { Button, EnumButtonStyle } from "../Components/Button";
import { ConfirmationDialog } from "../Components/ConfirmationDialog";
import PendingChangesContext from "../VersionControl/PendingChangesContext";

const CONFIRM_BUTTON = { icon: "delete_outline", label: "Delete" };
const DISMISS_BUTTON = { label: "Dismiss" };

type DType = {
  id: string;
};

type Props = {
  applicationId: string;
  entity: models.Entity;
  onDelete: () => void;
};

export const EntityListItem = ({ entity, applicationId, onDelete }: Props) => {
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
    });
  }, [entity, deleteEntity]);

  const [latestVersion] = entity.entityVersions;

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
          {entity.lockedByUser && (
            <UserAvatar
              firstName={entity.lockedByUser.account?.firstName}
              lastName={entity.lockedByUser.account?.lastName}
            />
          )}
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
            <UserAvatar
              firstName={latestVersion.commit.user?.account?.firstName}
              lastName={latestVersion.commit.user?.account?.lastName}
            />
          )}
          <span className="text-medium space-before">
            {latestVersion.commit?.message}{" "}
          </span>
          <span className="text-muted space-before">
            {latestVersion.commit?.createdAt}
          </span>
        </DataTableCell>
        <DataTableCell>
          {!deleteLoading && (
            <Button
              buttonStyle={EnumButtonStyle.Clear}
              icon="delete_outline"
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
