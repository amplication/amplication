import React, { useState, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { Snackbar } from "@rmwc/snackbar";
import { formatError } from "../util/error";
import * as models from "../models";
import { DataGrid, DataField } from "../Components/DataGrid";

import NewEntityField from "./NewEntityField";
import { EntityFieldListItem } from "./EntityFieldListItem";

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
    name: "dataType",
    title: "Data Type",
    sortable: true,
  },
  {
    name: "required",
    title: "Required",
    sortable: true,
    minWidth: true,
  },
  {
    name: "searchable",
    title: "Searchable",
    sortable: true,
    minWidth: true,
  },
  {
    name: "description",
    title: "Description",
    sortable: true,
  },
];

type TData = {
  entity: models.Entity;
};

type sortData = {
  field: string | null;
  order: number | null;
};

const DATE_CREATED_FIELD = "createdAt";

const INITIAL_SORT_DATA = {
  field: "position",
  order: 1,
};

type Props = {
  entityId: string;
};

export const EntityFieldList = React.memo(({ entityId }: Props) => {
  const [sortDir, setSortDir] = useState<sortData>(INITIAL_SORT_DATA);
  const [searchPhrase, setSearchPhrase] = useState<string>("");
  const [error, setError] = useState<Error>();

  const handleSortChange = (fieldName: string, order: number | null) => {
    setSortDir({ field: fieldName, order: order === null ? 1 : order });
  };

  const handleSearchChange = (value: string) => {
    setSearchPhrase(value);
  };

  const history = useHistory();

  const { data, loading, error: errorLoading, refetch } = useQuery<TData>(
    GET_FIELDS,
    {
      variables: {
        id: entityId,
        orderBy: {
          [sortDir.field || DATE_CREATED_FIELD]:
            sortDir.order === 1 ? models.SortOrder.Desc : models.SortOrder.Asc,
        },
        whereName:
          searchPhrase !== ""
            ? { contains: searchPhrase, mode: models.QueryMode.Insensitive }
            : undefined,
      },
    }
  );

  const errorMessage =
    formatError(errorLoading) || (error && formatError(error));

  const handleFieldAdd = useCallback(
    (field: models.EntityField) => {
      refetch();
      const fieldUrl = `/${data?.entity.appId}/entities/${entityId}/fields/${field.id}`;
      history.push(fieldUrl);
    },
    [data, history, entityId, refetch]
  );

  return (
    <>
      <DataGrid
        fields={fields}
        title="Entity Fields"
        loading={loading}
        sortDir={sortDir}
        onSortChange={handleSortChange}
        onSearchChange={handleSearchChange}
        toolbarContentStart={<NewEntityField onFieldAdd={handleFieldAdd} />}
      >
        {data?.entity.fields?.map((field) => (
          <EntityFieldListItem
            key={field.id}
            applicationId={data?.entity.appId}
            entityId={entityId}
            entityField={field}
            onDelete={refetch}
            onError={setError}
          />
        ))}
      </DataGrid>

      <Snackbar open={Boolean(error || errorLoading)} message={errorMessage} />
    </>
  );
  /**@todo: move error message to hosting page  */
});

/**@todo: expand search on other field  */
export const GET_FIELDS = gql`
  query getEntityFields(
    $id: String!
    $orderBy: EntityFieldOrderByInput
    $whereName: StringFilter
  ) {
    entity(where: { id: $id }) {
      id
      appId
      fields(where: { displayName: $whereName }, orderBy: $orderBy) {
        id
        displayName
        name
        dataType
        required
        searchable
        description
      }
    }
  }
`;
