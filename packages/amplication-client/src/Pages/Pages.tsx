import React from "react";
import { match } from "react-router-dom";
import "@rmwc/snackbar/styles";

import { BlockList } from "../Blocks/BlockList";
import * as models from "../models";
import "./Pages.scss";
import PageContent from "../Layout/PageContent";
import useBreadcrumbs from "../Layout/use-breadcrumbs";

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
  useBreadcrumbs(match.url, "Pages");
  return (
    <PageContent className="pages">
      <BlockList
        title="All UI Elements"
        applicationId={application}
        blockTypes={blockTypes}
      />
    </PageContent>
  );
}

export default Pages;
