import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "react-data-grid/lib/styles.css";

import ReactDataGrid, {
  Column,
  DataGridHandle,
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

export type DataGridRenderFilterProps = {
  key: string;
  columnKey: string;
  label: string;
  onChange: (key: string, filter: any) => void;
  onRemove: (key: string) => void;
  selectedValue: string | string[] | null;
  disabled: boolean;
  initialOpen?: boolean;
};

export type DataGridColumn<T> = Column<T> & {
  getValue?: (row: T) => any;
  hidden?: boolean;
  filterable?: boolean;
  name: string;
  sortKey?: string; //support keys with . notation like "project.id"
  renderFilter?: (props: DataGridRenderFilterProps) => ReactNode;
};

export type ExpandableDataGridRow<T> = T & {
  dataGridRowType: "MASTER" | "DETAIL";
  dataGridRowExpanded?: boolean;
};

export type Props<T> = Omit<
  DataGridProps<T>,
  "columns" | "onSortColumnsChange" | "rows" | "rowHeight"
> & {
  clientSideSort?: boolean;
  rowHeight?: number;
  columns: DataGridColumn<T>[];
  onSortColumnsChange?: (sortColumns: DataGridSortColumn[]) => void;
  rows: T[];
  enableRowDetails?: boolean;
  onColumnsReorder?: (sourceColumnKey: string, targetColumnKey: string) => void;
  onScrollToBottom?: () => void;
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
  onColumnsReorder,
  onScrollToBottom,
  ...rest
}: Props<T>) {
  const [sortColumns, setSortColumns] = useState<SortColumn[]>([]);
  const [rows, setRows] = useState<T[]>(incomingRows);
  const gridRef = useRef<DataGridHandle>(null);

  const visibleColumns = useMemo(
    () => columns.filter((c) => !c.hidden),
    [columns]
  );

  const handleSortColumnsChange = useCallback(
    (sortColumns: SortColumn[]) => {
      setSortColumns(sortColumns);

      const sortColumnsWithSortKey = sortColumns.map((sortColumn) => ({
        ...sortColumn,
        columnKey:
          columns.find((column) => column.key === sortColumn.columnKey)
            ?.sortKey || sortColumn.columnKey,
      }));

      onSortColumnsChange &&
        onSortColumnsChange(
          sortColumnsWithSortKey.map((sortColumn) => ({
            [sortColumn.columnKey]:
              SORT_DIRECTION_TO_DATA_GRID_SORT_ORDER[sortColumn.direction],
          }))
        );
    },
    [columns, onSortColumnsChange]
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

  const checkIfNoScrollAndLoadMore = useCallback(() => {
    if (gridRef.current) {
      const containerHeight = gridRef.current.element?.clientHeight || 0;
      const totalRowHeight = rows.length * rowHeight;

      if (totalRowHeight <= containerHeight && onScrollToBottom) {
        onScrollToBottom();
      }
    }
  }, [onScrollToBottom, rowHeight, rows]);

  useEffect(() => {
    checkIfNoScrollAndLoadMore(); // Check on mount and whenever rows change
  }, [checkIfNoScrollAndLoadMore, rows]);

  async function handleScroll(event: React.UIEvent<HTMLDivElement>) {
    //only trigger on scroll to bottom if the user is scrolling down
    if (isAtBottom(event) && event.currentTarget.scrollTop > 0) {
      onScrollToBottom && onScrollToBottom();
    }
  }

  return (
    <ReactDataGrid
      ref={gridRef}
      key={visibleColumns.length}
      columns={visibleColumns}
      style={{ maxHeight: "100%", height: "auto" }}
      rowHeight={rowHeight}
      onScroll={handleScroll}
      onRowsChange={onRowsChange}
      defaultColumnOptions={{
        sortable: true,
        resizable: true,
        draggable: true,
      }}
      rows={rows}
      onSortColumnsChange={handleSortColumnsChange}
      sortColumns={sortColumns}
      className={classNames(CLASS_NAME, className)}
      renderers={{
        renderSortStatus,
      }}
      onColumnsReorder={onColumnsReorder}
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

function isAtBottom({ currentTarget }: React.UIEvent<HTMLDivElement>): boolean {
  return (
    currentTarget.scrollTop + 10 >=
    currentTarget.scrollHeight - currentTarget.clientHeight
  );
}
