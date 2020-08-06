import React, { useState, useCallback } from "react";
import "./DataGrid.scss";
import * as types from "../types";
import DataGridItem from "./DataGridItem";
import SearchField from "../Components/SearchField";
import { paramCase } from "param-case";
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

type TData = {
  blocks: types.Block[];
};

type sortData = {
  field: string | null;
  order: number | null;
};

const NAME_FIELD = "displayName";
const DESCRIPTION_FIELD = "description";
const BLOCK_TYPE_FIELD = "blockType";

const INITIAL_SORT_DATA = {
  field: null,
  order: null,
};

type Props = {
  applicationId: string;
  blockTypes: typeof types.EnumBlockType[keyof typeof types.EnumBlockType][];
  blocks: types.Block[];
  title: string;
  loading: boolean;
  onSortChange: (fieldName: string, order: number | null) => void;
  onSearchChange: (value: string) => void;
  onFilterBlockTypeChange: (blockTypes: Set<types.EnumBlockType>) => void;
  sortDir: sortData;
  searchPhrase: string;
  filterBlockTypes: Set<types.EnumBlockType>;
};

export const DataGrid = ({
  applicationId,
  blocks,
  title,
  blockTypes,
  loading,
  sortDir,
  searchPhrase,
  filterBlockTypes,
  onSortChange,
  onSearchChange,
  onFilterBlockTypeChange,
}: Props) => {
  const handleFilterBlockTypeClick = useCallback(
    (blockType: types.EnumBlockType) => {
      let newSet = new Set([...filterBlockTypes]);
      if (!newSet.delete(blockType)) {
        newSet.add(blockType);
      }
      onFilterBlockTypeChange(newSet);
    },
    [filterBlockTypes, onFilterBlockTypeChange]
  );

  const handleSortChange = useCallback(
    (fieldName: string, order: number | null) => {
      onSortChange(fieldName, order === null ? 1 : order);
    },
    [onSortChange]
  );

  const handleSearchChange = useCallback(
    (value) => {
      onSearchChange(value);
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

          <SelectMenu title="Type" buttonStyle={EnumButtonStyle.Secondary}>
            <SelectMenuModal>
              <SelectMenuList>
                {blockTypes.map((item) => (
                  <SelectMenuItem
                    selected={filterBlockTypes.has(item)}
                    onSelectionChange={handleFilterBlockTypeClick}
                    itemData={item}
                  >
                    {item}
                  </SelectMenuItem>
                ))}
              </SelectMenuList>
            </SelectMenuModal>
          </SelectMenu>
          {/* <SelectMenu title="Tags" buttonStyle={EnumButtonStyle.Secondary}>
            <SelectMenuModal>
              <SelectMenuList>
                {["Tag1", "Tag2", "Tag3"].map((item) => (
                  <SelectMenuItem
                    selected={filterTags.has(item)}
                    onSelectionChange={handleFilterTagClick}
                    itemData={item}
                  >
                    {item}
                  </SelectMenuItem>
                ))}
              </SelectMenuList>
            </SelectMenuModal>
          </SelectMenu> */}
          <div className="stretch-tools" />
          <SelectMenu title="Create New">
            <SelectMenuModal>
              <SelectMenuList>
                {blockTypes.map((type) => (
                  <SelectMenuItem
                    href={`/${applicationId}/${paramCase(type)}/new`}
                  >
                    {type} {/** @todo: convert to local string */}
                  </SelectMenuItem>
                ))}
              </SelectMenuList>
            </SelectMenuModal>
          </SelectMenu>
        </div>
        <div className="amp-data-grid__list">
          <DataTable>
            <DataTableContent>
              <DataTableHead>
                <DataTableRow>
                  <SortableHeadCell
                    field={NAME_FIELD}
                    onSortChange={handleSortChange}
                    sortDir={sortDir}
                  >
                    Display Name
                  </SortableHeadCell>
                  <SortableHeadCell
                    field={BLOCK_TYPE_FIELD}
                    onSortChange={handleSortChange}
                    sortDir={sortDir}
                  >
                    Type
                  </SortableHeadCell>

                  <DataTableHeadCell>Version</DataTableHeadCell>
                  <SortableHeadCell
                    field={DESCRIPTION_FIELD}
                    onSortChange={handleSortChange}
                    sortDir={sortDir}
                  >
                    Description
                  </SortableHeadCell>
                  <DataTableHeadCell>Tags </DataTableHeadCell>
                </DataTableRow>
              </DataTableHead>
              <DataTableBody>
                {blocks?.map((block) => (
                  <DataGridItem
                    navigateUrl={`/${applicationId}/${paramCase(
                      block.blockType
                    )}/${block.id}`}
                    name={block.displayName}
                    type={block.blockType}
                    versionNumber={"V" + block.versionNumber}
                    description={block.description}
                  />
                ))}
              </DataTableBody>
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
  onSortChange: (fieldName: string, order: number | null) => void;
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
      onSortChange(field, sortDir);
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
