import React from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { Snackbar } from "@rmwc/snackbar";
import "./BlockList.scss";
import { formatError } from "../util/error";
import * as types from "../types";
import BlockListItem from "./BlockListItem";
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

export const BlockList = ({
  applicationId,
  blockTypes,
}: {
  applicationId: string;
  blockTypes: typeof types.EnumBlockType[keyof typeof types.EnumBlockType][];
}) => {
  const [sortDir, setSortDir] = React.useState<{
    field: string | null;
    order: number | null;
  }>({
    field: null,
    order: null,
  });

  const { data, loading, error } = useQuery<TData>(GET_BLOCKS, {
    variables: {
      id: applicationId,
      blockTypes: blockTypes,
      orderby: {
        [sortDir.field || "name"]: sortDir.order === 1 ? "desc" : "asc",
      },
    },
  });

  const errorMessage = formatError(error);

  /**@todo:replace "Loading" with a loader */
  return (
    <>
      <div className="block-list">
        <DataTable>
          <DataTableContent>
            <DataTableHead>
              <DataTableRow>
                <DataTableHeadCell
                  sort={sortDir.field === "name" ? sortDir.order : null}
                  onSortChange={(sortDir) => {
                    setSortDir({ field: "name", order: sortDir });
                  }}
                >
                  Name
                </DataTableHeadCell>
                <DataTableHeadCell
                  sort={sortDir.field === "blockType" ? sortDir.order : null}
                  onSortChange={(sortDir) => {
                    setSortDir({ field: "blockType", order: sortDir });
                  }}
                >
                  Type
                </DataTableHeadCell>
                <DataTableHeadCell>Version</DataTableHeadCell>
                <DataTableHeadCell
                  sort={sortDir.field === "description" ? sortDir.order : null}
                  onSortChange={(sortDir) => {
                    setSortDir({ field: "description", order: sortDir });
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

export const GET_BLOCKS = gql`
  query getPages(
    $id: String!
    $blockTypes: [EnumBlockType!]
    $orderby: BlockOrderByInput
  ) {
    blocks(
      where: { app: { id: $id }, blockType: { in: $blockTypes } }
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
