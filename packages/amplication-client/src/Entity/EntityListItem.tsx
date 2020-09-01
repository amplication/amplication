import React, { useCallback, useContext } from "react";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import * as models from "../models";
import DataGridRow from "../Components/DataGridRow";
import { DataTableCell } from "@rmwc/data-table";
import { Link } from "react-router-dom";
import "@rmwc/data-table/styles";

import UserAvatar from "../Components/UserAvatar";
import { Button, EnumButtonStyle } from "../Components/Button";
import PendingChangesContext from "../VersionControl/PendingChangesContext";

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

  const [deleteEntity] = useMutation<DType>(DELETE_ENTITY, {
    onCompleted: (data) => {
      console.log(data);
      pendingChangesContext.addEntity(data.id);
      onDelete();
    },
  });

  const handleDelete = useCallback(
    (evt) => {
      deleteEntity({
        variables: {
          entityId: entity.id,
        },
      });
      evt.stopPropagation();
    },
    [entity, deleteEntity]
  );

  const [latestVersion] = entity.entityVersions;

  return (
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
        <Button
          buttonStyle={EnumButtonStyle.Clear}
          icon="delete_outline"
          onClick={handleDelete}
        />
      </DataTableCell>
    </DataGridRow>
  );
};

const DELETE_ENTITY = gql`
  mutation deleteEntity($entityId: String!) {
    deleteEntity(where: { id: $entityId }) {
      id
    }
  }
`;
