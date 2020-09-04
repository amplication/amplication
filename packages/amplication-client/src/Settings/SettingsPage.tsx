import React from "react";
import { match, useRouteMatch } from "react-router-dom";
import { isEmpty } from "lodash";

import PageContent from "../Layout/PageContent";
import FloatingToolbar from "../Layout/FloatingToolbar";
import { RoleList } from "./RoleList";
import Role from "./Role";
import Sidebar from "../Layout/Sidebar";

type Props = {
  match: match<{ application: string }>;
};

const SettingsPage = ({ match }: Props) => {
  const { application } = match.params;

  const roleMatch = useRouteMatch<{ roleId: string }>(
    "/:application/settings/roles/:roleId"
  );

  let roleId = null;
  if (roleMatch) {
    roleId = roleMatch.params.roleId;
  }

  return (
    <PageContent className="settings" withFloatingBar>
      <main>
        <FloatingToolbar />
        <RoleList applicationId={application} />
      </main>
      <Sidebar modal open={!isEmpty(roleId)}>
        {!isEmpty(roleId) && <Role />}
      </Sidebar>
    </PageContent>
  );
};

export default SettingsPage;
