import React from "react";
import { match } from "react-router-dom";
import { AppRouteProps } from "../routes/routesUtil";
import ModuleList from "./ModuleList";

type Props = AppRouteProps & {
  match: match<{
    resource: string;
  }>;
};

const ModulesPage: React.FC<Props> = ({ match, innerRoutes }: Props) => {
  const { resource } = match.params;

  return match.isExact ? <ModuleList resourceId={resource} /> : innerRoutes;
};

export default ModulesPage;
