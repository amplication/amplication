import React from "react";
import * as types from "../types";
import { DataTableCell, DataTableRow } from "@rmwc/data-table";

type Props = {
  block: types.Block;
};

const BlockListItem = ({ block }: Props) => {
  return (
    <DataTableRow className="block-list-item">
      <DataTableCell>{block.name}</DataTableCell>
      <DataTableCell>{block.blockType}</DataTableCell>
      <DataTableCell>V{block.versionNumber || "1"}</DataTableCell>
      <DataTableCell>{block.description}</DataTableCell>
      <DataTableCell>
        <span className="tag tag1">Tag #1</span>
        <span className="tag tag2">Tag #2</span>
        <span className="tag tag3">Tag #3</span>
      </DataTableCell>
    </DataTableRow>
  );
};
export default BlockListItem;
