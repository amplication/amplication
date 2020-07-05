import React from "react";
import { match } from "react-router-dom";
import "@rmwc/snackbar/styles";
import "./Pages.scss";
import { BlockList } from "../Blocks/BlockList";
import * as types from "../types";

type Props = {
  match: match<{ application: string }>;
};

type TData = {
  blocks: types.Block[];
};

function Pages({ match }: Props) {
  const { application } = match.params;

  return (
    <>
      <main className="pages">
        <h2>All UI Elements</h2>
        <BlockList
          applicationId={application}
          blockTypes={[
            types.EnumBlockType.Layout,
            types.EnumBlockType.CanvasPage,
            types.EnumBlockType.EntityPage,
            types.EnumBlockType.Document,
          ]}
        />
      </main>
    </>
  );
}

export default Pages;
