import React, { useCallback, useEffect, useMemo, useState } from "react";
import "react-data-grid/lib/styles.css";

import ReactDataGrid, {
  Column,
  DataGridProps,
  RenderSortStatusProps,
  RowsChangeData,
  SortColumn,
  SortDirection,
} from "react-data-grid";

import "./DataGrid.scss";

import classNames from "classnames";
import { Icon } from "../Icon/Icon";

//These value similar to the ones we use in the backend
export type DataGridSortOrder = "Asc" | "Desc";

export type DataGridSortColumn = {
  [key: string]: DataGridSortOrder;
};

export type DataGridColumn<T> = Column<T> & {
  getValue?: (row: T) => any;
  hidden?: boolean;
};

export type ExpandableDataGridRow<T> = T & {
  dataGridRowType: "MASTER" | "DETAIL";
  dataGridRowExpanded?: boolean;
};

export type Props<T> = Omit<
  DataGridProps<T>,
  "columns" | "onSortColumnsChange" | "rows"
> & {
  clientSideSort?: boolean;
  columns: DataGridColumn<T>[];
  onSortColumnsChange?: (sortColumns: DataGridSortColumn[]) => void;
  rows: T[];
  enableRowDetails?: boolean;
};

const SORT_DIRECTION_TO_DATA_GRID_SORT_ORDER: Record<
  SortDirection,
  DataGridSortOrder
> = {
  ASC: "Asc",
  DESC: "Desc",
};

export const CLASS_NAME = "amp-data-grid";

export function DataGrid<T>({
  className,
  rowHeight = 50,
  clientSideSort = true,
  rows: incomingRows,
  columns,
  onSortColumnsChange,
  enableRowDetails,
  ...rest
}: Props<T>) {
  const [sortColumns, setSortColumns] = useState<SortColumn[]>([]);
  const [rows, setRows] = useState<T[]>(incomingRows);

  const visibleColumns = useMemo(
    () => columns.filter((c) => !c.hidden),
    [columns]
  );

  const handleSortColumnsChange = useCallback(
    (sortColumns: SortColumn[]) => {
      setSortColumns(sortColumns);

      onSortColumnsChange &&
        onSortColumnsChange(
          sortColumns.map((sortColumn) => ({
            [sortColumn.columnKey]:
              SORT_DIRECTION_TO_DATA_GRID_SORT_ORDER[sortColumn.direction],
          }))
        );
    },
    [onSortColumnsChange]
  );

  const columnValueGetters = useMemo(() => {
    return columns.reduce((acc, column) => {
      if ("getValue" in column && "key" in column && column.getValue) {
        acc[column.key] = column.getValue;
      }
      return acc;
    }, {} as Record<string, (row: T) => any>);
  }, [columns]);

  const sortedRows = useMemo(() => {
    if (clientSideSort) {
      // Sort the rows based on the sort columns
      return [...incomingRows].sort((a, b) => {
        for (const { columnKey, direction } of sortColumns) {
          const valueA = columnValueGetters[columnKey]
            ? columnValueGetters[columnKey](a)
            : (a as any)[columnKey];

          const valueB = columnValueGetters[columnKey]
            ? columnValueGetters[columnKey](b)
            : (b as any)[columnKey];

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
    return incomingRows;
  }, [clientSideSort, columnValueGetters, incomingRows, sortColumns]);

  useEffect(() => {
    setRows(sortedRows);
  }, [sortedRows]);

  function onRowsChange(rows: T[], { indexes }: RowsChangeData<T>) {
    if (enableRowDetails) {
      const row = rows[indexes[0]] as unknown as ExpandableDataGridRow<T>;

      if (row.dataGridRowType !== "DETAIL") {
        if (row.dataGridRowExpanded) {
          rows.splice(indexes[0] + 1, 0, {
            ...row,
            dataGridRowType: "DETAIL",
            dataGridRowExpanded: false,
          } as ExpandableDataGridRow<T>);
        } else {
          rows.splice(indexes[0] + 1, 1);
        }

        setRows(rows);
      }
    }
  }

  return (
    <ReactDataGrid
      key={visibleColumns.length}
      columns={visibleColumns}
      style={{ maxHeight: "100%", height: "auto" }}
      rowHeight={rowHeight}
      onRowsChange={onRowsChange}
      defaultColumnOptions={{}}
      rows={rows}
      onSortColumnsChange={handleSortColumnsChange}
      sortColumns={sortColumns}
      className={classNames(CLASS_NAME, className)}
      renderers={{
        renderSortStatus,
      }}
      {...rest}
    />
  );
}

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
