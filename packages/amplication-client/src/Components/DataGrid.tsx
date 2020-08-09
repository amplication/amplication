import React, { useCallback, ReactNode, useMemo } from "react";
import "./DataGrid.scss";
import SearchField from "../Components/SearchField";
import {
  SelectMenu,
  SelectMenuModal,
  SelectMenuItem,
  SelectMenuList,
} from "../Components/SelectMenu";

import { EnumButtonStyle } from "../Components/Button";

import {
  DataTable,
  DataTableContent,
  DataTableHead,
  DataTableRow,
  DataTableHeadCell,
  DataTableBody,
} from "@rmwc/data-table";
import "@rmwc/data-table/styles";
import { isEmpty, keyBy } from "lodash";

type sortData = {
  field: string | null;
  order: number | null;
};

type FilterItem = {
  value: string;
  label: string;
};

type FilterChangeData = {
  fieldName: string;
  value: string;
};

type DataFilter = {
  selected: Set<string>;
  filterItems: FilterItem[];
};

export type DataField = {
  name: string;
  title: string;
  sortable?: boolean;
  filter?: DataFilter;
};

type Props = {
  fields: DataField[];
  title: string;
  loading: boolean;
  onSortChange?: (fieldName: string, order: number | null) => void;
  onSearchChange?: (value: string) => void;
  onFilterChange?: (fieldName: string, selectedItems: Set<string>) => void;
  sortDir: sortData;
  children: ReactNode;
  toolbarContent: ReactNode;
};

export const DataGrid = ({
  children,
  fields,
  title,
  loading,
  sortDir,
  toolbarContent,
  onSortChange,
  onSearchChange,
  onFilterChange,
}: Props) => {
  const fieldsByName = useMemo(() => keyBy(fields, (field) => field.name), [
    fields,
  ]);

  const handleFilterChange = useCallback(
    ({ fieldName, value }: FilterChangeData) => {
      const field = fieldsByName[fieldName];
      let newSet = new Set([...field.filter?.selected]);
      if (!newSet.delete(value)) {
        newSet.add(value);
      }
      if (onFilterChange) {
        onFilterChange(fieldName, newSet);
      }
    },
    [fieldsByName, onFilterChange]
  );

  const handleSortChange = useCallback(
    (fieldName: string, order: number | null) => {
      const field = fieldsByName[fieldName];
      if (field.sortable && onSortChange) {
        onSortChange(fieldName, order === null ? 1 : order);
      }
    },
    [onSortChange, fieldsByName]
  );

  const handleSearchChange = useCallback(
    (value) => {
      if (onSearchChange) {
        onSearchChange(value);
      }
    },
    [onSearchChange]
  );

  return (
    <div className="amp-data-grid">
      <div className="amp-data-grid__toolbar">
        <h2>{title}</h2>

        <SearchField
          label="search"
          placeholder="search"
          onChange={handleSearchChange}
        />

        {fields
          .filter((field) => !isEmpty(field.filter))
          .map((field) => (
            <SelectMenu
              title={field.title}
              buttonStyle={EnumButtonStyle.Secondary}
            >
              <SelectMenuModal>
                <SelectMenuList>
                  {field.filter?.filterItems.map((item) => (
                    <SelectMenuItem
                      selected={field.filter?.selected.has(item.value)}
                      onSelectionChange={handleFilterChange}
                      itemData={{
                        fieldName: field.name,
                        value: item.value,
                      }}
                    >
                      {item.label}
                    </SelectMenuItem>
                  ))}
                </SelectMenuList>
              </SelectMenuModal>
            </SelectMenu>
          ))}

        <div className="stretch-tools" />
        {toolbarContent}
      </div>
      <div className="amp-data-grid__list">
        <DataTable>
          <DataTableContent>
            <DataTableHead>
              <DataTableRow>
                {fields.map((field) => (
                  <SortableHeadCell
                    field={field.name}
                    onSortChange={handleSortChange}
                    sortDir={sortDir}
                  >
                    {field.title}
                  </SortableHeadCell>
                ))}
              </DataTableRow>
            </DataTableHead>
            <DataTableBody>{children}</DataTableBody>
          </DataTableContent>
        </DataTable>
      </div>
      {loading && <span>Loading...</span>}
      <div className="amp-data-grid__footer">Footer</div>
    </div>
  );
  /**@todo: complete footer  */
};

type SortableHeadCellProps = {
  field: string;
  children: React.ReactNode;
  onSortChange?: (fieldName: string, order: number | null) => void;
  sortDir: sortData;
};

const SortableHeadCell = ({
  field,
  onSortChange,
  children,
  sortDir,
}: SortableHeadCellProps) => {
  const handleSortChange = useCallback(
    (sortDir) => {
      if (onSortChange) {
        onSortChange(field, sortDir);
      }
    },
    [field, onSortChange]
  );
  return (
    <DataTableHeadCell
      sort={sortDir.field === field ? sortDir.order : null}
      onSortChange={handleSortChange}
    >
      {children}
    </DataTableHeadCell>
  );
};
