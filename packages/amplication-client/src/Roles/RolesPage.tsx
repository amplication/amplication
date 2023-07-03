import React from "react";
import { match, useRouteMatch } from "react-router-dom";
import { isEmpty } from "lodash";
import PageContent from "../Layout/PageContent";
import Role from "./Role";
import { RoleList } from "./RoleList";
import { AppRouteProps } from "../routes/routesUtil";

type Props = AppRouteProps & {
  match: match<{
    resource: string;
  }>;
};

const RolesPage: React.FC<Props> = ({ match, innerRoutes }: Props) => {
  const { resource } = match.params;
  const pageTitle = "Roles";

  const roleMatch = useRouteMatch<{ roleId: string }>(
    "/:workspace/:project/:resource/roles/:roleId"
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
      {match.isExact ? !isEmpty(roleId) && <Role /> : innerRoutes}
    </PageContent>
  );
};

export default RolesPage;
