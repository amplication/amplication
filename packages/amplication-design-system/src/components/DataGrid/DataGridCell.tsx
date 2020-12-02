import React from "react";
import { DataTableCell } from "@rmwc/data-table";

export type Props = {
  /** Changes alignment for numeric columns */
  isNumeric?: boolean;
  /** Align content to the start of the cell. */
  alignStart?: boolean;
  /** Align content to the middle of the cell. */
  alignMiddle?: boolean;
  /** Align content to the end of the cell. */
  alignEnd?: boolean;
  className?: string;

  children: React.ReactNode;
};

const DataGridCell = ({ children, ...rest }: Props) => {
  return <DataTableCell {...rest}>{children}</DataTableCell>;
};
export default DataGridCell;
