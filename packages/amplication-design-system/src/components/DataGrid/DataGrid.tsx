import React, { useCallback, ReactNode, useMemo } from "react";
import {
  DataTable,
  DataTableContent,
  DataTableHead,
  DataTableRow,
  DataTableBody,
} from "@rmwc/data-table";
import "@rmwc/data-table/styles";
import { Icon } from "@rmwc/icon";
import { keyBy } from "lodash";
import { DataGridSortableHeader } from "./DataGridSortableHeader";
import SearchField from "../SearchField/SearchField";
import {
  SelectMenu,
  SelectMenuModal,
  SelectMenuItem,
  SelectMenuList,
} from "../SelectMenu/SelectMenu";
import { EnumButtonStyle } from "../Button/Button";
import "./DataGrid.scss";
import {
  DataField,
  SortData,
  DataFilter,
  SortOrder,
  FilterChangeData,
} from "./types";

export enum EnumTitleType {
  PageTitle = "PageTitle",
  SectionTitle = "SectionTitle",
}

export type Props = {
  /** Fields to display in the data grid */
  fields: DataField[];
  /** Title of the data grid */
  title: string;
  /** The type of presentation for the title of the data grid */
  titleType?: EnumTitleType;
  /** Whether the data grid is in a state of loading */
  loading: boolean;
  /** The field the data is ordered by */
  sortDir: SortData;
  children: ReactNode;
  /** Optional elements to present before the data grid's toolbar */
  toolbarContentStart?: ReactNode;
  /** Optional elements to present after the data grid's toolbar */
  toolbarContentEnd?: ReactNode;
  /** Whether to display a search bar in the toolbar */
  showSearch?: boolean;
  /** The conditions the data is filtered by */
  filters?: DataFilter[];
  onSortChange?: (sortData: SortData) => void;
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
  showSearch,
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
        onSortChange({
          field: fieldName,
          order: order === null ? SortOrder.Descending : order,
        });
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
        {showSearch && (
          <SearchField
            label="search"
            placeholder="search"
            onChange={handleSearchChange}
          />
        )}
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
                  <DataGridSortableHeader
                    key={field.name}
                    field={field}
                    onSortChange={handleSortChange}
                    sortDir={sortDir}
                  >
                    {field.icon && (
                      <Icon icon={{ icon: field.icon, size: "small" }} />
                    )}
                    {field.title}
                  </DataGridSortableHeader>
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
