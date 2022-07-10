import React from "react";
import { match, useRouteMatch } from "react-router-dom";
import { isEmpty } from "lodash";

import PageContent from "../Layout/PageContent";
import Role from "./Role";
import useNavigationTabs from "../Layout/UseNavigationTabs";
import { RoleList } from "./RoleList";

type Props = {
  match: match<{ resource: string }>;
};
const NAVIGATION_KEY = "ROLE";

const RolesPage = ({ match }: Props) => {
  const { resource } = match.params;
  const pageTitle = "Roles";
  useNavigationTabs(resource, NAVIGATION_KEY, match.url, pageTitle);

  const roleMatch = useRouteMatch<{ roleId: string }>(
    "/:resource/roles/:roleId"
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
        <RoleList resourceId={resource} selectFirst={null === roleId} />
      }
    >
      {!isEmpty(roleId) && <Role />}
    </PageContent>
  );
};

export default RolesPage;
