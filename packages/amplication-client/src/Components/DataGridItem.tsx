import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { DataTableCell, DataTableRow } from "@rmwc/data-table";
import { Link } from "react-router-dom";

type Props = {
  navigateUrl: string;
  name: string;
  type: string;
  versionNumber: string;
  description: string;
};

const DataGridItem = ({
  name,
  type,
  versionNumber,
  description,
  navigateUrl,
}: Props) => {
  const history = useHistory();
  const handleClick = useCallback(() => {
    history.push(navigateUrl);
  }, [navigateUrl, history]);

  return (
    <>
      <DataTableRow className="amp-data-grid-item" onClick={handleClick}>
        <DataTableCell>
          <Link
            className="amp-data-grid-item--navigate"
            title={name}
            to={navigateUrl}
          >
            {name}
          </Link>
        </DataTableCell>
        <DataTableCell>{type}</DataTableCell>
        <DataTableCell>{versionNumber}</DataTableCell>
        <DataTableCell>{description}</DataTableCell>
        <DataTableCell>
          <span className="tag tag1">Tag #1</span>
          <span className="tag tag2">Tag #2</span>
          <span className="tag tag3">Tag #3</span>
        </DataTableCell>
      </DataTableRow>
    </>
  );
};
export default DataGridItem;
