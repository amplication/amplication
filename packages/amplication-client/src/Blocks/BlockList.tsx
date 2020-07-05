import React, { useState, useCallback } from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { Snackbar } from "@rmwc/snackbar";
import "./BlockList.scss";
import { formatError } from "../util/error";
import * as types from "../types";
import BlockListItem from "./BlockListItem";
import SearchField from "../Components/SearchField";

import {
  DataTable,
  DataTableContent,
  DataTableHead,
  DataTableRow,
  DataTableHeadCell,
  DataTableBody,
} from "@rmwc/data-table";
import "@rmwc/data-table/styles";
type TData = {
  blocks: types.Block[];
};

type sortData = {
  field: string | null;
  order: number | null;
};

export const BlockList = ({
  applicationId,
  blockTypes,
  title,
}: {
  applicationId: string;
  blockTypes: typeof types.EnumBlockType[keyof typeof types.EnumBlockType][];
  title: string;
}) => {
  const [sortDir, setSortDir] = useState<sortData>({
    field: null,
    order: null,
  });

  const [searchPhrase, setSearchPhrase] = useState<string>("");

  const handleSortChange = useCallback(
    (fieldName: string, order: number | null) => {
      setSortDir({ field: fieldName, order: order });
    },
    [setSortDir]
  );

  const handleSearchChange = useCallback(
    (value) => {
      setSearchPhrase(value);
    },
    [setSearchPhrase]
  );

  const { data, loading, error } = useQuery<TData>(GET_BLOCKS, {
    variables: {
      id: applicationId,
      blockTypes: blockTypes,
      orderby: {
        [sortDir.field || "name"]: sortDir.order === 1 ? "desc" : "asc",
      },
      whereName: searchPhrase !== "" ? { contains: searchPhrase } : undefined,
    },
  });

  const errorMessage = formatError(error);

  /**@todo:replace "Loading" with a loader */
  return (
    <>
      <div className="block-list">
        <div className="toolbar">
          <h2>{title}</h2>
          <SearchField
            label="search"
            placeholder="search"
            onChange={handleSearchChange}
          />
        </div>
        <DataTable>
          <DataTableContent>
            <DataTableHead>
              <DataTableRow>
                <DataTableHeadCell
                  sort={sortDir.field === "name" ? sortDir.order : null}
                  onSortChange={(sortDir) => {
                    handleSortChange("name", sortDir);
                  }}
                >
                  Name
                </DataTableHeadCell>
                <DataTableHeadCell
                  sort={sortDir.field === "blockType" ? sortDir.order : null}
                  onSortChange={(sortDir) => {
                    handleSortChange("blockType", sortDir);
                  }}
                >
                  Type
                </DataTableHeadCell>
                <DataTableHeadCell>Version</DataTableHeadCell>
                <DataTableHeadCell
                  sort={sortDir.field === "description" ? sortDir.order : null}
                  onSortChange={(sortDir) => {
                    handleSortChange("description", sortDir);
                  }}
                >
                  Description
                </DataTableHeadCell>
                <DataTableHeadCell>Tags </DataTableHeadCell>
              </DataTableRow>
            </DataTableHead>
            <DataTableBody>
              {data?.blocks.map((block) => (
                <BlockListItem block={block} />
              ))}
            </DataTableBody>
          </DataTableContent>
        </DataTable>
      </div>
      {loading && <span>Loading...</span>}
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </>
  );
  /**@todo: move error message to hosting page  */
};

/**@todo: expand search on other field  */
/**@todo: find a solution for case insensitive search  */
export const GET_BLOCKS = gql`
  query getPages(
    $id: String!
    $blockTypes: [EnumBlockType!]
    $orderby: BlockOrderByInput
    $whereName: StringFilter
  ) {
    blocks(
      where: {
        app: { id: $id }
        blockType: { in: $blockTypes }
        name: $whereName
      }
      orderBy: $orderby
    ) {
      id
      name
      blockType
      versionNumber
      description
    }
  }
`;
