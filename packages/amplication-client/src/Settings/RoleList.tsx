import React, { useState, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { Snackbar } from "@rmwc/snackbar";
import { formatError } from "../util/error";
import * as models from "../models";
import { DataGrid, DataField } from "../Components/DataGrid";
import DataGridRow from "../Components/DataGridRow";
import { DataTableCell } from "@rmwc/data-table";
import { Link } from "react-router-dom";
import NewRole from "./NewRole";

import "@rmwc/data-table/styles";

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

type sortData = {
  field: string | null;
  order: number | null;
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
  const [sortDir, setSortDir] = useState<sortData>(INITIAL_SORT_DATA);
  const [searchPhrase, setSearchPhrase] = useState<string>("");

  const handleSortChange = (fieldName: string, order: number | null) => {
    setSortDir({ field: fieldName, order: order === null ? 1 : order });
  };

  const handleSearchChange = (value: string) => {
    setSearchPhrase(value);
  };

  const history = useHistory();

  const { data, loading, error, refetch } = useQuery<TData>(GET_ROLES, {
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

  const handleRoleAdd = useCallback(
    (role: models.AppRole) => {
      refetch();
      const fieldUrl = `/${applicationId}/settings/roles/${role.id}`;
      history.push(fieldUrl);
    },
    [history, applicationId, refetch]
  );

  return (
    <>
      <DataGrid
        fields={fields}
        title="Roles"
        loading={loading}
        sortDir={sortDir}
        onSortChange={handleSortChange}
        onSearchChange={handleSearchChange}
        toolbarContentStart={
          <NewRole onRoleAdd={handleRoleAdd} applicationId={applicationId} />
        }
      >
        {data?.appRoles.map((role) => {
          const roleUrl = `/${applicationId}/settings/roles/${role.id}`;

          return (
            <DataGridRow navigateUrl={roleUrl}>
              <DataTableCell>
                <Link
                  className="amp-data-grid-item--navigate"
                  title={role.displayName}
                  to={roleUrl}
                >
                  <span className="text-medium">{role.displayName}</span>
                </Link>
              </DataTableCell>
              <DataTableCell>{role.name}</DataTableCell>
              <DataTableCell>{role.description}</DataTableCell>
            </DataGridRow>
          );
        })}
      </DataGrid>

      <Snackbar open={Boolean(error)} message={errorMessage} />
    </>
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
