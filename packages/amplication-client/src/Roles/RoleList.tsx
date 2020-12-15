import React, { useState, useCallback } from "react";
import { useHistory, Link } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { Snackbar } from "@rmwc/snackbar";
import { formatError } from "../util/error";
import * as models from "../models";
import {
  DataGrid,
  DataField,
  EnumTitleType,
  DataGridRow,
  DataGridCell,
  SortData,
} from "@amplication/design-system";
import NewRole from "./NewRole";
import "./RoleList.scss";

const fields: DataField[] = [
  {
    name: "displayName",
    title: "Display Name",
    sortable: true,
  },
  {
    name: "name",
    title: "Name",
    sortable: true,
  },
  {
    name: "description",
    title: "Description",
    sortable: true,
  },
];

type TData = {
  appRoles: models.AppRole[];
};

const DATE_CREATED_FIELD = "createdAt";

const INITIAL_SORT_DATA = {
  field: null,
  order: null,
};

type Props = {
  applicationId: string;
};

export const RoleList = React.memo(({ applicationId }: Props) => {
  const [sortDir, setSortDir] = useState<SortData>(INITIAL_SORT_DATA);
  const [searchPhrase, setSearchPhrase] = useState<string>("");

  const handleSortChange = (sortData: SortData) => {
    setSortDir(sortData);
  };

  const handleSearchChange = (value: string) => {
    setSearchPhrase(value);
  };

  const history = useHistory();

  const { data, loading, error } = useQuery<TData>(GET_ROLES, {
    variables: {
      id: applicationId,
      orderBy: {
        [sortDir.field || DATE_CREATED_FIELD]:
          sortDir.order === 1 ? models.SortOrder.Desc : models.SortOrder.Asc,
      },
      whereName:
        searchPhrase !== ""
          ? {
              contains: searchPhrase,
              mode: models.QueryMode.Insensitive,
            }
          : undefined,
    },
  });

  const errorMessage = formatError(error);

  const handleRoleChange = useCallback(
    (role: models.AppRole) => {
      const fieldUrl = `/${applicationId}/roles/${role.id}`;
      history.push(fieldUrl);
    },
    [history, applicationId]
  );

  return (
    <div className="role-list">
      <DataGrid
        showSearch
        fields={fields}
        title="Roles"
        titleType={EnumTitleType.PageTitle}
        loading={loading}
        sortDir={sortDir}
        onSortChange={handleSortChange}
        onSearchChange={handleSearchChange}
        toolbarContentStart={
          <NewRole onRoleAdd={handleRoleChange} applicationId={applicationId} />
        }
      >
        {data?.appRoles.map((role) => {
          const roleUrl = `/${applicationId}/roles/${role.id}`;

          return (
            <DataGridRow
              onClick={handleRoleChange}
              clickData={role}
              key={role.id}
            >
              <DataGridCell>
                <Link
                  className="amp-data-grid-item--navigate"
                  title={role.displayName}
                  to={roleUrl}
                >
                  <span className="text-medium">{role.displayName}</span>
                </Link>
              </DataGridCell>
              <DataGridCell>{role.name}</DataGridCell>
              <DataGridCell>{role.description}</DataGridCell>
            </DataGridRow>
          );
        })}
      </DataGrid>

      <Snackbar open={Boolean(error)} message={errorMessage} />
    </div>
  );
});

export const GET_ROLES = gql`
  query getRoles(
    $id: String!
    $orderBy: AppRoleOrderByInput
    $whereName: StringFilter
  ) {
    appRoles(
      where: { app: { id: $id }, displayName: $whereName }
      orderBy: $orderBy
    ) {
      id
      name
      displayName
      description
    }
  }
`;
