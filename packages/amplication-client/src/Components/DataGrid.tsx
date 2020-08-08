import React, { useCallback } from "react";
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
import { isEmpty } from "lodash";

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
  dataGridRows: React.ReactNode;
  toolbarContent: React.ReactNode;
};

export const DataGrid = ({
  dataGridRows,
  fields,
  title,
  loading,
  sortDir,
  toolbarContent,
  onSortChange,
  onSearchChange,
  onFilterChange,
}: Props) => {
  const handleFilterChange = useCallback(
    ({ fieldName, value }: FilterChangeData) => {
      const field = fields.find((field) => field.name === fieldName);
      if (field) {
        let newSet = new Set([...field.filter?.selected]);
        if (!newSet.delete(value)) {
          newSet.add(value);
        }
        onFilterChange && onFilterChange(fieldName, newSet);
      }
    },
    [fields, onFilterChange]
  );

  const handleSortChange = useCallback(
    (fieldName: string, order: number | null) => {
      onSortChange && onSortChange(fieldName, order === null ? 1 : order);
    },
    [onSortChange]
  );

  const handleSearchChange = useCallback(
    (value) => {
      onSearchChange && onSearchChange(value);
    },
    [onSearchChange]
  );

  return (
    <>
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
                        itemData={{ fieldName: field.name, value: item.value }}
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
                      onSortChange={
                        field.sortable ? handleSortChange : undefined
                      }
                      sortDir={sortDir}
                    >
                      {field.title}
                    </SortableHeadCell>
                  ))}
                </DataTableRow>
              </DataTableHead>
              <DataTableBody>{dataGridRows}</DataTableBody>
            </DataTableContent>
          </DataTable>
        </div>
        {loading && <span>Loading...</span>}
        <div className="amp-data-grid__footer">Footer</div>
      </div>
    </>
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
      if (onSortChange !== undefined) {
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
