import React from "react";
import { match } from "react-router-dom";
import "@rmwc/snackbar/styles";
import {
  SelectMenu,
  SelectMenuModal,
  SelectMenuItem,
  SelectMenuList,
} from "../Components/SelectMenu";

import { BlockList } from "../Blocks/BlockList";
import * as types from "../types";
import { HeaderToolbar } from "../util/teleporter";
import "./Pages.scss";
import PageContent from "../Layout/PageContent";

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
      <HeaderToolbar.Source>
        <SelectMenu title="Create New">
          <SelectMenuModal>
            <SelectMenuList>
              <SelectMenuItem href={`/${application}/entity-page/new`}>
                Entity Page
              </SelectMenuItem>
              <SelectMenuItem href={`/${application}/canvas-page/new`}>
                Canvas Page
              </SelectMenuItem>
              <SelectMenuItem href={`/${application}/document/new`}>
                Document
              </SelectMenuItem>
            </SelectMenuList>
          </SelectMenuModal>
        </SelectMenu>
      </HeaderToolbar.Source>
      <PageContent className="pages">
        <main>
          <BlockList
            title="All UI Elements"
            applicationId={application}
            blockTypes={[
              types.EnumBlockType.Layout,
              types.EnumBlockType.CanvasPage,
              types.EnumBlockType.EntityPage,
              types.EnumBlockType.Document,
            ]}
          />
        </main>
      </PageContent>
    </>
  );
}

export default Pages;
