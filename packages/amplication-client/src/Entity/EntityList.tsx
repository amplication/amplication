import React, { useState } from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { Snackbar } from "@rmwc/snackbar";
import { formatError } from "../util/error";
import * as types from "../types";
import { DataGrid, DataField } from "../Components/DataGrid";
import DataGridRow from "../Components/DataGridRow";
import { DataTableCell } from "@rmwc/data-table";
import { Link } from "react-router-dom";

import "@rmwc/data-table/styles";

const fields: DataField[] = [
  {
    name: "displayName",
    title: "Name",
    sortable: true,
  },
  {
    name: "versionNumber",
    title: "Version",
  },
  {
    name: "description",
    title: "Description",
    sortable: true,
  },
  {
    name: "tags",
    title: "Tags",
    sortable: false,
  },
];

type TData = {
  entities: types.Entity[];
};

type sortData = {
  field: string | null;
  order: number | null;
};

const NAME_FIELD = "displayName";

const INITIAL_SORT_DATA = {
  field: null,
  order: null,
};

type Props = {
  applicationId: string;
};

export const EntityList = ({ applicationId }: Props) => {
  const [sortDir, setSortDir] = useState<sortData>(INITIAL_SORT_DATA);

  const [searchPhrase, setSearchPhrase] = useState<string>("");

  const handleSortChange = (fieldName: string, order: number | null) => {
    setSortDir({ field: fieldName, order: order === null ? 1 : order });
  };

  const handleSearchChange = (value: string) => {
    setSearchPhrase(value);
  };

  const { data, loading, error } = useQuery<TData>(GET_ENTITIES, {
    variables: {
      id: applicationId,
      orderBy: {
        [sortDir.field || NAME_FIELD]:
          sortDir.order === 1 ? types.OrderByArg.desc : types.OrderByArg.asc,
      },
      whereName: searchPhrase !== "" ? { contains: searchPhrase } : undefined,
    },
  });

  const errorMessage = formatError(error);

  return (
    <>
      <DataGrid
        fields={fields}
        title="Entities"
        loading={loading}
        sortDir={sortDir}
        onSortChange={handleSortChange}
        onSearchChange={handleSearchChange}
        toolbarContent={<div> create new</div>}
        dataGridRows={data?.entities.map((entity) => (
          <DataGridRow navigateUrl={`/${applicationId}/entity/${entity.id}`}>
            <DataTableCell>
              <Link
                className="amp-data-grid-item--navigate"
                title={entity.displayName}
                to={`/${applicationId}/entity/${entity.id}`}
              >
                {entity.displayName}
              </Link>
            </DataTableCell>
            <DataTableCell>{entity.versionNumber}</DataTableCell>
            <DataTableCell>{entity.description}</DataTableCell>
            <DataTableCell>
              <span className="tag tag1">Tag #1</span>
              <span className="tag tag2">Tag #2</span>
              <span className="tag tag3">Tag #3</span>
            </DataTableCell>
          </DataGridRow>
        ))}
      ></DataGrid>

      <Snackbar open={Boolean(error)} message={errorMessage} />
    </>
  );
  /**@todo: move error message to hosting page  */
};

/**@todo: expand search on other field  */
/**@todo: find a solution for case insensitive search  */
export const GET_ENTITIES = gql`
  query getEntities(
    $id: String!
    $orderBy: EntityOrderByInput
    $whereName: StringFilter
  ) {
    entities(
      where: { app: { id: $id }, displayName: $whereName }
      orderBy: $orderBy
    ) {
      id
      displayName
      versionNumber
      description
    }
  }
`;
