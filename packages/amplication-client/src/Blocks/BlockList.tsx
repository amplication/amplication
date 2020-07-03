import React from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { Snackbar } from "@rmwc/snackbar";
import "@rmwc/snackbar/styles";
import "./BlockList.scss";
import { formatError } from "../util/error";
import * as types from "../types";

type TData = {
  blocks: types.Block[];
};

export const BlockList = ({
  applicationId,
  blockTypes,
}: {
  applicationId: string;
  blockTypes: typeof types.EnumBlockType[keyof typeof types.EnumBlockType][];
}) => {
  const { data, loading, error } = useQuery<TData>(GET_BLOCKS, {
    variables: {
      id: applicationId,
      blockTypes: blockTypes,
    },
  });

  if (loading) {
    return <span>Loading...</span>;
  }

  const errorMessage = formatError(error);

  return (
    <>
      <div className="block-list">
        {data?.blocks.map((block) => (
          <>
            <div> {block.id} </div>
            <div> {block.name} </div>
            <div> {block.description} </div>
            <div> {block.versionNumber} </div>
            <div> {block.blockType} </div>
          </>
        ))}
      </div>
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </>
  );
  /**@todo: move error message to hosting page  */
};

/**@todo: change to dynamic blockType parameter */
export const GET_BLOCKS = gql`
  query getPages($id: String!) {
    blocks(
      where: {
        app: { id: $id }
        blockType: { in: [Layout, CanvasPage, EntityPage, Document] }
      }
      orderBy: { blockType: desc }
    ) {
      id
      name
      blockType
      versionNumber
      description
    }
  }
`;
