import React from "react";
import { match } from "react-router-dom";
import "@rmwc/snackbar/styles";

import { BlockList } from "../Blocks/BlockList";
import * as types from "../types";
import "./Pages.scss";
import PageContent from "../Layout/PageContent";

type Props = {
  match: match<{ application: string }>;
};

type TData = {
  blocks: types.Block[];
};

const blockTypes = [
  types.EnumBlockType.Layout,
  types.EnumBlockType.CanvasPage,
  types.EnumBlockType.EntityPage,
  types.EnumBlockType.Document,
];

function Pages({ match }: Props) {
  const { application } = match.params;

  return (
    <>
      <PageContent className="pages" withFloatingBar>
        <main>
          <BlockList
            title="All UI Elements"
            applicationId={application}
            blockTypes={blockTypes}
          />
        </main>
      </PageContent>
    </>
  );
}

export default Pages;
