import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import * as types from "../types";
import { DataTableCell, DataTableRow } from "@rmwc/data-table";
import { Link } from "react-router-dom";
import { paramCase } from "param-case";

type Props = {
  block: types.Block;
  applicationId: string;
};

const BlockListItem = ({ block, applicationId }: Props) => {
  const history = useHistory();
  const handleClick = useCallback(() => {
    history.push(`/${applicationId}/${paramCase(block.blockType)}/${block.id}`);
  }, [applicationId, block.blockType, block.id, history]);

  return (
    <DataTableRow className="block-list-item" onClick={handleClick}>
      <DataTableCell>
        <Link
          className="block-list-item--navigate"
          title={block.name}
          to={`/${applicationId}/${paramCase(block.blockType)}/${block.id}`}
        >
          {block.name}
        </Link>
      </DataTableCell>
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
