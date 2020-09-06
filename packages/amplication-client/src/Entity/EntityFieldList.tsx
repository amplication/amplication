import React, { useState, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { Snackbar } from "@rmwc/snackbar";
import { Icon } from "@rmwc/icon";
import { formatError } from "../util/error";
import * as models from "../models";
import { DataGrid, DataField } from "../Components/DataGrid";
import DataGridRow from "../Components/DataGridRow";
import { DataTableCell } from "@rmwc/data-table";
import { Link } from "react-router-dom";
import CircleIcon from "../Components/CircleIcon";
import NewEntityField from "./NewEntityField";
import { DATA_TYPE_TO_LABEL_AND_ICON } from "./constants";

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
    name: "description",
    title: "Description",
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
  field: null,
  order: null,
};

type Props = {
  entityId: string;
};

export const EntityFieldList = React.memo(({ entityId }: Props) => {
  const [sortDir, setSortDir] = useState<sortData>(INITIAL_SORT_DATA);
  const [searchPhrase, setSearchPhrase] = useState<string>("");

  const handleSortChange = (fieldName: string, order: number | null) => {
    setSortDir({ field: fieldName, order: order === null ? 1 : order });
  };

  const handleSearchChange = (value: string) => {
    setSearchPhrase(value);
  };

  const history = useHistory();

  const { data, loading, error, refetch } = useQuery<TData>(GET_FIELDS, {
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
  });

  const errorMessage = formatError(error);

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
        {data?.entity.fields?.map((field) => {
          const fieldUrl = `/${data?.entity.appId}/entities/${entityId}/fields/${field.id}`;

          return (
            <DataGridRow navigateUrl={fieldUrl}>
              <DataTableCell>
                <Link
                  className="amp-data-grid-item--navigate"
                  title={field.displayName}
                  to={fieldUrl}
                >
                  <span className="text-medium">{field.displayName}</span>
                </Link>
              </DataTableCell>
              <DataTableCell>{field.name}</DataTableCell>
              <DataTableCell>
                <Icon
                  className="amp-data-grid-item__icon"
                  icon={{
                    icon: DATA_TYPE_TO_LABEL_AND_ICON[field.dataType].icon,
                    size: "xsmall",
                  }}
                />
                {DATA_TYPE_TO_LABEL_AND_ICON[field.dataType].label}
              </DataTableCell>
              <DataTableCell>{field.description}</DataTableCell>
              <DataTableCell alignMiddle>
                {field.required && <CircleIcon icon="check" />}
              </DataTableCell>
              <DataTableCell alignMiddle>
                {field.searchable && <CircleIcon icon="check" />}
              </DataTableCell>
            </DataGridRow>
          );
        })}
      </DataGrid>

      <Snackbar open={Boolean(error)} message={errorMessage} />
    </>
  );
  /**@todo: move error message to hosting page  */
});

/**@todo: expand search on other field  */
/**@todo: find a solution for case insensitive search  */
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
