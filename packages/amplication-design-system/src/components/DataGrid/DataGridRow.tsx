import React, { useCallback } from "react";
import { DataTableRow } from "@rmwc/data-table";

export type Props = {
  clickData?: any;
  children: React.ReactNode;
  onClick?: (clickData: any) => void;
};

const DataGridRow = ({ children, clickData, onClick }: Props) => {
  const handleClick = useCallback(() => {
    if (onClick) {
      onClick(clickData);
    }
  }, [onClick, clickData]);

  return (
    <DataTableRow className="amp-data-grid-item" onClick={handleClick}>
      {children}
    </DataTableRow>
  );
};
export default DataGridRow;
