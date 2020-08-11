import React from "react";
import { match } from "react-router-dom";
import "@rmwc/snackbar/styles";

import { BlockList } from "../Blocks/BlockList";
import * as models from "../models";
import "./Pages.scss";
import PageContent from "../Layout/PageContent";
import FloatingToolbar from "../Layout/FloatingToolbar";

type Props = {
  match: match<{ application: string }>;
};

type TData = {
  blocks: models.Block[];
};

const blockTypes = [
  models.EnumBlockType.Layout,
  models.EnumBlockType.CanvasPage,
  models.EnumBlockType.EntityPage,
  models.EnumBlockType.Document,
];

function Pages({ match }: Props) {
  const { application } = match.params;

  return (
    <>
      <PageContent className="pages" withFloatingBar>
        <main>
          <FloatingToolbar />
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
