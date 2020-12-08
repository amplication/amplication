import React, { useCallback } from "react";
import { DataTableHeadCell } from "@rmwc/data-table";
import "@rmwc/data-table/styles";
import { Icon } from "@rmwc/icon";
import classNames from "classnames";

import { DataField, SortData, SortOrder } from "./types";

type Props = {
  field: DataField;
  children: React.ReactNode;
  onSortChange?: (fieldName: string, order: number | null) => void;
  sortDir: SortData;
};

export const DataGridSortableHeader = ({
  field,
  onSortChange,
  children,
  sortDir,
}: Props) => {
  const handleSortChange = useCallback(
    (sortDir) => {
      if (field.sortable && onSortChange) {
        onSortChange(field.name, sortDir);
      }
    },
    [field, onSortChange]
  );

  const icon =
    sortDir.field === field.name
      ? sortDir.order === SortOrder.Descending
        ? "sort_down"
        : "sort_up"
      : "sort_default";

  return (
    <DataTableHeadCell
      className={classNames({ "min-width": field.minWidth })}
      sort={sortDir.field === field.name ? sortDir.order : null}
      onSortChange={handleSortChange}
    >
      {children}
      {field.sortable && <Icon className="sort-icon" icon={icon} />}
    </DataTableHeadCell>
  );
};
