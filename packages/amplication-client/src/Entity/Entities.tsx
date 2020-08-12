import React from "react";
import { match } from "react-router-dom";
import "@rmwc/snackbar/styles";

import { EntityList } from "./EntityList";
import "./Entities.scss";
import PageContent from "../Layout/PageContent";
import FloatingToolbar from "../Layout/FloatingToolbar";

type Props = {
  match: match<{ application: string }>;
};

function Entities({ match }: Props) {
  const { application } = match.params;

  return (
    <PageContent className="pages" withFloatingBar>
      <main>
        <FloatingToolbar />
        <EntityList applicationId={application} />
      </main>
    </PageContent>
  );
}

export default Entities;
