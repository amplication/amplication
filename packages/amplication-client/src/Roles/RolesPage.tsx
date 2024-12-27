import React from "react";
import { match } from "react-router-dom";
import { AppRouteProps } from "../routes/routesUtil";
import { RoleList } from "./RoleList";

type Props = AppRouteProps & {
  match: match<{
    resource: string;
  }>;
};

const RolesPage: React.FC<Props> = ({ match, innerRoutes }: Props) => {
  return (
    <div className="roles">{match.isExact ? <RoleList /> : innerRoutes}</div>
  );
};

export default RolesPage;
