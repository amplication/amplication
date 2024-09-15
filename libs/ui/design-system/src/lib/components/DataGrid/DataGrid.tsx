import React, { useCallback, useMemo, useState } from "react";
import "react-data-grid/lib/styles.css";

import ReactDataGrid, {
  DataGridProps,
  RenderSortStatusProps,
  SortColumn,
} from "react-data-grid";

import "./DataGrid.scss";

import classNames from "classnames";
import { Icon } from "../Icon/Icon";

export type Props<T> = DataGridProps<T> & {
  clientSideSort?: boolean;
};

const CLASS_NAME = "amp-data-grid";

export const DataGrid: React.FC<Props<any>> = ({
  className,
  rowHeight = 50,
  clientSideSort = true,
  rows,
  ...rest
}) => {
  const [sortColumns, setSortColumns] = useState<SortColumn[]>([]);

  const onSortColumnsChange = useCallback((sortColumns: SortColumn[]) => {
    setSortColumns(sortColumns);
  }, []);
  const sortedRows = useMemo(() => {
    if (clientSideSort) {
      // Sort the rows based on the sort columns
      return [...rows].sort((a, b) => {
        for (const { columnKey, direction } of sortColumns) {
          const valueA = a[columnKey];
          const valueB = b[columnKey];

          if (valueA < valueB) {
            return direction === "ASC" ? -1 : 1;
          }
          if (valueA > valueB) {
            return direction === "ASC" ? 1 : -1;
          }
        }

        return 0;
      });
    }
    return rows;
  }, [clientSideSort, rows, sortColumns]);

  return (
    <ReactDataGrid
      style={{ maxHeight: "100%", height: "auto" }}
      rowHeight={rowHeight}
      defaultColumnOptions={{}}
      rows={sortedRows}
      onSortColumnsChange={onSortColumnsChange}
      sortColumns={sortColumns}
      className={classNames(CLASS_NAME, className)}
      renderers={{
        renderSortStatus,
      }}
      {...rest}
    />
  );
};

export default DataGrid;

function renderSortStatus({ sortDirection, priority }: RenderSortStatusProps) {
  const iconName = sortDirection === "ASC" ? "arrow_up" : "arrow_down";
  return sortDirection !== undefined ? (
    <>
      <Icon icon={iconName} size="xsmall" />
      <span>{priority}</span>
    </>
  ) : null;
}
