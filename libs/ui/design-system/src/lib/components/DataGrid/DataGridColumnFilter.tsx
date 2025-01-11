import "react-data-grid/lib/styles.css";

import { useCallback } from "react";
import { EnumButtonStyle, EnumIconPosition } from "../Button/Button";
import { EnumGapSize, EnumItemsAlign, FlexItem } from "../FlexItem/FlexItem";
import { Icon } from "../Icon/Icon";
import {
  SelectMenu,
  SelectMenuItem,
  SelectMenuList,
  SelectMenuModal,
} from "../SelectMenu/SelectMenu";
import { DataGridColumn } from "./DataGrid";

export type Props<T> = {
  columns: DataGridColumn<T>[];
  onColumnsChanged: (columns: DataGridColumn<T>[]) => void;
};

export const CLASS_NAME = "amp-data-grid-column-filter";

export function DataGridColumnFilter<T>({
  columns,
  onColumnsChanged,
}: Props<T>) {
  const handleSelectionChange = useCallback(
    (column: DataGridColumn<T>) => {
      const newColumns = columns.map((c) =>
        c.key === column.key ? { ...c, hidden: !c.hidden } : c
      );
      onColumnsChanged && onColumnsChanged(newColumns);
      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, 2000);
    },
    [columns, onColumnsChanged]
  );

  return (
    <SelectMenu
      className={CLASS_NAME}
      buttonIconPosition={EnumIconPosition.Left}
      title={
        <FlexItem gap={EnumGapSize.Small} itemsAlign={EnumItemsAlign.Center}>
          <Icon icon="option_set" />
        </FlexItem>
      }
      buttonStyle={EnumButtonStyle.Text}
    >
      <SelectMenuModal>
        <SelectMenuList>
          {columns.map((column) => (
            <SelectMenuItem
              closeAfterSelectionChange={false}
              key={column.key}
              selected={!column.hidden}
              itemData={column}
              onSelectionChange={handleSelectionChange}
            >
              {column.name}
            </SelectMenuItem>
          ))}
        </SelectMenuList>
      </SelectMenuModal>
    </SelectMenu>
  );
}

export default DataGridColumnFilter;
