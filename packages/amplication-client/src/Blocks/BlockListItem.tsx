import React from "react";
import "./BlockListItem.scss";
import * as types from "../types";
import { DataTableCell, DataTableRow } from "@rmwc/data-table";
//function BlockListItem = ({ block }: { block: types.Block }) => {

function BlockListItem({ block }: { block: types.Block }) {
  return (
    <DataTableRow className="block-list-item">
      <DataTableCell>{block.name}</DataTableCell>
      <DataTableCell>{block.blockType}</DataTableCell>
      <DataTableCell>{block.versionNumber}</DataTableCell>
      <DataTableCell>{block.description}</DataTableCell>
      <DataTableCell>Tags</DataTableCell>
    </DataTableRow>
  );
}
export default BlockListItem;
