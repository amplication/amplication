import React from "react";
import { match } from "react-router-dom";

import PageContent from "../Layout/PageContent";

import "./PendingChanges.scss";

const CLASS_NAME = "pending-changes";

type Props = {
  match: match<{ applicationId: string }>;
};

const PendingChanges = ({ match }: Props) => {
  const { applicationId } = match.params;

  return (
    <PageContent className={CLASS_NAME} withFloatingBar>
      <main>Pending Changes {applicationId}</main>
    </PageContent>
  );
};

export default PendingChanges;
