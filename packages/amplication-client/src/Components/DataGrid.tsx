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
import keyBy from "lodash.keyby";

type sortData = {
  field: string | null;
  order: number | null;
};

type FilterItem = {
  value: string;
  label: string;
};

type FilterChangeData = {
  filterName: string;
  value: string;
};

export type DataFilter = {
  name: string;
  title: string;
  selected: Set<string>;
  filterItems: FilterItem[];
};

export type DataField = {
  name: string;
  title: string;
  sortable?: boolean;
  className?: string;
};

type Props = {
  fields: DataField[];
  title: string;
  loading: boolean;
  onSortChange?: (fieldName: string, order: number | null) => void;
  onSearchChange?: (value: string) => void;
  onFilterChange?: (filters: DataFilter[]) => void;
  sortDir: sortData;
  children: ReactNode;
  toolbarContent: ReactNode;
  filters?: DataFilter[];
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
  filters,
}: Props) => {
  const fieldsByName = useMemo(() => keyBy(fields, (field) => field.name), [
    fields,
  ]);

  const handleFilterChange = useCallback(
    ({ filterName, value }: FilterChangeData) => {
      if (filters) {
        const filter = filters.find((item) => item.name === filterName);

        if (filter) {
          let newSet = new Set([...filter?.selected]);
          if (!newSet.delete(value)) {
            newSet.add(value);
          }
          if (onFilterChange) {
            filter.selected = newSet;

            let newFilters = [...filters];
            onFilterChange(newFilters);
          }
        }
      }
    },
    [filters, onFilterChange]
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

        {filters?.map((filter) => (
          <SelectMenu
            title={filter.title}
            buttonStyle={EnumButtonStyle.Secondary}
          >
            <SelectMenuModal>
              <SelectMenuList>
                {filter.filterItems.map((item) => (
                  <SelectMenuItem
                    selected={filter.selected.has(item.value)}
                    onSelectionChange={handleFilterChange}
                    itemData={{
                      filterName: filter.name,
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
                    className={field.className}
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
  className?: string;
};

const SortableHeadCell = ({
  field,
  onSortChange,
  children,
  sortDir,
  className,
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
      className={className}
      sort={sortDir.field === field ? sortDir.order : null}
      onSortChange={handleSortChange}
    >
      {children}
    </DataTableHeadCell>
  );
};
