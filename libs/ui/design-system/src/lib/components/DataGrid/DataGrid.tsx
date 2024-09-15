import React, { useCallback, useMemo, useState } from "react";
import "react-data-grid/lib/styles.css";

import ReactDataGrid, {
  ColumnOrColumnGroup,
  DataGridProps,
  RenderSortStatusProps,
  SortColumn,
} from "react-data-grid";

import "./DataGrid.scss";

import classNames from "classnames";
import { Icon } from "../Icon/Icon";

export type DataGridColumn<T> = ColumnOrColumnGroup<T> & {
  getValue?: (row: T) => any;
};

export type Props<T> = Omit<DataGridProps<T>, "columns"> & {
  clientSideSort?: boolean;
  columns: DataGridColumn<T>[];
};

const CLASS_NAME = "amp-data-grid";

export const DataGrid: React.FC<Props<any>> = ({
  className,
  rowHeight = 50,
  clientSideSort = true,
  rows,
  columns,
  ...rest
}) => {
  const [sortColumns, setSortColumns] = useState<SortColumn[]>([]);

  const onSortColumnsChange = useCallback((sortColumns: SortColumn[]) => {
    setSortColumns(sortColumns);
  }, []);

  const columnValueGetters = useMemo(() => {
    return columns.reduce((acc, column) => {
      if (column.getValue && "key" in column) {
        acc[column.key] = column.getValue;
      }
      return acc;
    }, {} as Record<string, (row: any) => any>);
  }, [columns]);

  const sortedRows = useMemo(() => {
    if (clientSideSort) {
      // Sort the rows based on the sort columns
      return [...rows].sort((a, b) => {
        for (const { columnKey, direction } of sortColumns) {
          const valueA = columnValueGetters[columnKey]
            ? columnValueGetters[columnKey](a)
            : a[columnKey];

          const valueB = columnValueGetters[columnKey]
            ? columnValueGetters[columnKey](b)
            : b[columnKey];

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
      columns={columns}
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
