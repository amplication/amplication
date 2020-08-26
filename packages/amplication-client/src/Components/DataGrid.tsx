import React, { useCallback, ReactNode, useMemo } from "react";
import "./DataGrid.scss";
import SearchField from "../Components/SearchField";
import {
  SelectMenu,
  SelectMenuModal,
  SelectMenuItem,
  SelectMenuList,
} from "../Components/SelectMenu";
import { Icon } from "@rmwc/icon";

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
import classNames from "classnames";
import keyBy from "lodash.keyby";

type sortData = {
  field: string | null;
  order: number | null;
};

export enum EnumTitleType {
  PageTitle = "PageTitle",
  SectionTitle = "SectionTitle",
}

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
  minWidth?: boolean;
};

type Props = {
  /** Fields to display in the data grid */
  fields: DataField[];
  /** Title of the data grid */
  title: string;
  /** The type of presentation for the title of the data grid */
  titleType?: EnumTitleType;
  /** Whether the data grid is in a state of loading */
  loading: boolean;
  /** The field the data is ordered by */
  sortDir: sortData;
  children: ReactNode;
  /** Optional elements to present before the data grid's toolbar */
  toolbarContentStart?: ReactNode;
  /** Optional elements to present after the data grid's toolbar */
  toolbarContentEnd?: ReactNode;
  /** The conditions the data is filtered by */
  filters?: DataFilter[];
  onSortChange?: (fieldName: string, order: number | null) => void;
  onSearchChange?: (value: string) => void;
  onFilterChange?: (filters: DataFilter[]) => void;
};

export const DataGrid = ({
  children,
  fields,
  title,
  titleType,
  loading,
  sortDir,
  toolbarContentStart,
  toolbarContentEnd,
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
        {titleType === EnumTitleType.PageTitle ? (
          <h1>{title}</h1>
        ) : (
          <h2>{title}</h2>
        )}

        {toolbarContentStart}

        <div className="stretch-tools" />
        <SearchField
          label="search"
          placeholder="search"
          onChange={handleSearchChange}
        />

        {filters?.map((filter) => (
          <SelectMenu
            key={filter.name}
            title={filter.title}
            buttonStyle={EnumButtonStyle.Secondary}
          >
            <SelectMenuModal>
              <SelectMenuList>
                {filter.filterItems.map((item) => (
                  <SelectMenuItem
                    key={item.value}
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
        {toolbarContentEnd}
      </div>
      <div className="amp-data-grid__list">
        <DataTable>
          <DataTableContent>
            <DataTableHead>
              <DataTableRow>
                {fields.map((field) => (
                  <SortableHeadCell
                    key={field.name}
                    field={field}
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
    </div>
  );
  /**@todo: complete footer  */
};

type SortableHeadCellProps = {
  field: DataField;
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
      if (field.sortable && onSortChange) {
        onSortChange(field.name, sortDir);
      }
    },
    [field, onSortChange]
  );

  const icon =
    sortDir.field === field.name
      ? sortDir.order === 1
        ? "expand_less"
        : "expand_more"
      : "unfold_more";

  return (
    <DataTableHeadCell
      className={classNames({ "min-width": field.minWidth })}
      sort={sortDir.field === field.name ? sortDir.order : null}
      onSortChange={handleSortChange}
    >
      {children}
      {field.sortable && <Icon icon={icon} />}
    </DataTableHeadCell>
  );
};
