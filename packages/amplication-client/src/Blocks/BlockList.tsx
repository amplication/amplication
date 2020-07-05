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
  const { data, loading, error } = useQuery<TData>(GET_BLOCKS, {
    variables: {
      id: applicationId,
      blockTypes: blockTypes,
    },
  });

  if (loading) {
    return <span>Loading...</span>;
  }

  const errorMessage = formatError(error);

  return (
    <>
      <div className="block-list">
        <DataTable>
          <DataTableContent>
            <DataTableHead>
              <DataTableRow>
                <DataTableHeadCell>Name</DataTableHeadCell>
                <DataTableHeadCell>Type</DataTableHeadCell>
                <DataTableHeadCell>Version</DataTableHeadCell>
                <DataTableHeadCell>Description</DataTableHeadCell>
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
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </>
  );
  /**@todo: move error message to hosting page  */
};

export const GET_BLOCKS = gql`
  query getPages($id: String!, $blockTypes: [EnumBlockType!]) {
    blocks(
      where: { app: { id: $id }, blockType: { in: $blockTypes } }
      orderBy: { blockType: desc }
    ) {
      id
      name
      blockType
      versionNumber
      description
    }
  }
`;
