import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { DataTableRow } from "@rmwc/data-table";

type Props = {
  navigateUrl?: string;
  children: React.ReactNode;
};

const DataGridRow = ({ children, navigateUrl }: Props) => {
  const history = useHistory();
  const handleClick = useCallback(() => {
    if (navigateUrl) {
      history.push(navigateUrl);
    }
  }, [navigateUrl, history]);

  return (
    <DataTableRow className="amp-data-grid-item" onClick={handleClick}>
      {children}
    </DataTableRow>
  );
};
export default DataGridRow;
