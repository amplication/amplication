import React from "react";
import { match, useRouteMatch } from "react-router-dom";
import { isEmpty } from "lodash";

import PageContent from "../Layout/PageContent";
import Role from "./Role";
import useNavigationTabs from "../Layout/UseNavigationTabs";
import { RoleList } from "./RoleList";

type Props = {
  match: match<{ application: string }>;
};
const NAVIGATION_KEY = "ROLE";

const RolesPage = ({ match }: Props) => {
  const { application } = match.params;
  const pageTitle = "Roles";
  useNavigationTabs(application, NAVIGATION_KEY, match.url, pageTitle);

  const roleMatch = useRouteMatch<{ roleId: string }>(
    "/:application/roles/:roleId"
  );

  let roleId = null;
  if (roleMatch) {
    roleId = roleMatch.params.roleId;
  }

  return (
    <PageContent
      pageTitle={pageTitle}
      className="roles"
      sideContent={
        <RoleList applicationId={application} selectFirst={null === roleId} />
      }
    >
      {!isEmpty(roleId) && <Role />}
    </PageContent>
  );
};

export default RolesPage;
