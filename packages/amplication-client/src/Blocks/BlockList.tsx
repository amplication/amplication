import React, { useState, useCallback } from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { Snackbar } from "@rmwc/snackbar";
import "./BlockList.scss";
import { formatError } from "../util/error";
import * as types from "../types";
import BlockListItem from "./BlockListItem";
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

type TData = {
  blocks: types.Block[];
};

type sortData = {
  field: string | null;
  order: number | null;
};

const NAME_FIELD = "name";
const DESCRIPTION_FIELD = "description";
const BLOCK_TYPE_FIELD = "blockType";

const INITIAL_SORT_DATA = {
  field: null,
  order: null,
};

type Props = {
  applicationId: string;
  blockTypes: typeof types.EnumBlockType[keyof typeof types.EnumBlockType][];
  title: string;
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

export const BlockList = ({ applicationId, blockTypes, title }: Props) => {
  const [sortDir, setSortDir] = useState<sortData>(INITIAL_SORT_DATA);

  const [searchPhrase, setSearchPhrase] = useState<string>("");

  const [filterBlockTypes, setFilterBlockTypes] = useState<
    Set<types.EnumBlockType>
  >(new Set());

  const [filterTags, setFilterTags] = useState<Set<string>>(new Set());

  const handleFilterBlockTypeClick = useCallback(
    (blockType: types.EnumBlockType) => {
      let newSet = new Set([...filterBlockTypes]);
      if (!newSet.delete(blockType)) {
        newSet.add(blockType);
      }
      setFilterBlockTypes(newSet);
    },
    [filterBlockTypes]
  );

  const handleFilterTagClick = useCallback(
    (tag: string) => {
      let newSet = new Set([...filterTags]);
      if (!newSet.delete(tag)) {
        newSet.add(tag);
      }
      setFilterTags(newSet);
    },
    [filterTags]
  );

  const handleSortChange = useCallback(
    (fieldName: string, order: number | null) => {
      setSortDir({ field: fieldName, order: order === null ? 1 : order });
    },
    [setSortDir]
  );

  const handleSearchChange = useCallback(
    (value) => {
      setSearchPhrase(value);
    },
    [setSearchPhrase]
  );

  const { data, loading, error } = useQuery<TData>(GET_BLOCKS, {
    variables: {
      id: applicationId,
      blockTypes:
        filterBlockTypes && filterBlockTypes.size
          ? [...filterBlockTypes]
          : blockTypes,
      orderBy: {
        [sortDir.field || NAME_FIELD]:
          sortDir.order === 1 ? types.OrderByArg.desc : types.OrderByArg.asc,
      },
      whereName: searchPhrase !== "" ? { contains: searchPhrase } : undefined,
    },
  });

  const errorMessage = formatError(error);

  /**@todo:replace "Loading" with a loader */
  return (
    <>
      <div className="block-list">
        <div className="block-list__toolbar">
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
          <SelectMenu title="Tags" buttonStyle={EnumButtonStyle.Secondary}>
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
          </SelectMenu>
        </div>
        <div className="block-list__list">
          <DataTable>
            <DataTableContent>
              <DataTableHead>
                <DataTableRow>
                  <SortableHeadCell
                    field={NAME_FIELD}
                    onSortChange={handleSortChange}
                    sortDir={sortDir}
                  >
                    Name
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
                {data?.blocks.map((block) => (
                  <BlockListItem block={block} applicationId={applicationId} />
                ))}
              </DataTableBody>
            </DataTableContent>
          </DataTable>
          {loading && <span>Loading...</span>}
        </div>
        <div className="block-list__footer">Footer</div>
      </div>

      <Snackbar open={Boolean(error)} message={errorMessage} />
    </>
  );
  /**@todo: complete footer  */
  /**@todo: move error message to hosting page  */
};

/**@todo: expand search on other field  */
/**@todo: find a solution for case insensitive search  */
export const GET_BLOCKS = gql`
  query getPages(
    $id: String!
    $blockTypes: [EnumBlockType!]
    $orderBy: BlockOrderByInput
    $whereName: StringFilter
  ) {
    blocks(
      where: {
        app: { id: $id }
        blockType: { in: $blockTypes }
        name: $whereName
      }
      orderBy: $orderBy
    ) {
      id
      name
      blockType
      versionNumber
      description
    }
  }
`;
