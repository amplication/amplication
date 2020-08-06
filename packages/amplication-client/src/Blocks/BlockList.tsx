import React, { useState } from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { Snackbar } from "@rmwc/snackbar";
import { formatError } from "../util/error";
import * as types from "../types";
import { DataGrid } from "../Components/DataGrid";

import "@rmwc/data-table/styles";

type TData = {
  blocks: types.Block[];
};

type sortData = {
  field: string | null;
  order: number | null;
};

const NAME_FIELD = "displayName";

const INITIAL_SORT_DATA = {
  field: null,
  order: null,
};

type Props = {
  applicationId: string;
  blockTypes: typeof types.EnumBlockType[keyof typeof types.EnumBlockType][];
  title: string;
};

export const BlockList = ({ applicationId, blockTypes, title }: Props) => {
  const [sortDir, setSortDir] = useState<sortData>(INITIAL_SORT_DATA);

  const [searchPhrase, setSearchPhrase] = useState<string>("");

  const [filterBlockTypes, setFilterBlockTypes] = useState<
    Set<types.EnumBlockType>
  >(new Set());

  const handleSortChange = (fieldName: string, order: number | null) => {
    setSortDir({ field: fieldName, order: order === null ? 1 : order });
  };

  const handleSearchChange = (value: string) => {
    setSearchPhrase(value);
  };

  const handleFilterBlockTypeChange = (newSet: Set<types.EnumBlockType>) => {
    setFilterBlockTypes(newSet);
  };

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
      <DataGrid
        blocks={data?.blocks || []}
        title={title}
        blockTypes={blockTypes}
        applicationId={applicationId}
        loading={loading}
        sortDir={sortDir}
        searchPhrase={searchPhrase}
        filterBlockTypes={filterBlockTypes}
        onSortChange={handleSortChange}
        onSearchChange={handleSearchChange}
        onFilterBlockTypeChange={handleFilterBlockTypeChange}
      ></DataGrid>

      <Snackbar open={Boolean(error)} message={errorMessage} />
    </>
  );
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
        displayName: $whereName
      }
      orderBy: $orderBy
    ) {
      id
      displayName
      blockType
      versionNumber
      description
    }
  }
`;
