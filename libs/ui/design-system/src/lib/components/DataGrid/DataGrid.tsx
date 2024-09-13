import React from "react";
import "./DataGrid.scss";
import {
  DataGrid as MuiDataGrid,
  DataGridProps as MuiDataGridProps,
} from "@mui/x-data-grid";
import classNames from "classnames";

export type Props = MuiDataGridProps & {
  className?: string;
};

const CLASS_NAME = "amp-data-grid";

export const DataGrid: React.FC<Props> = ({ className, classes, ...rest }) => {
  return (
    <MuiDataGrid
      className={classNames(CLASS_NAME, className)}
      classes={{
        root: "amp-data-grid__root",
        columnHeader: "amp-data-grid__column-header",
        columnHeaders: "amp-data-grid__column-headers",
        cell: "amp-data-grid__cell",
        row: "amp-data-grid__row",
        footerContainer: "amp-data-grid__footer-container",
        cellEmpty: "amp-data-grid__cell-empty",
        ...classes,
      }}
      {...rest}
    />
  );
};

export default DataGrid;
