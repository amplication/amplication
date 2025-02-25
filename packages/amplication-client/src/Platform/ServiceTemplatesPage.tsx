import React from "react";
import { match } from "react-router-dom";
import { AppRouteProps } from "../routes/routesUtil";
import ServiceTemplateList from "./ServiceTemplateList";
import useBreadcrumbs from "../Layout/useBreadcrumbs";
type Props = AppRouteProps & {
  match: match<{
    workspace: string;
    project: string;
  }>;
};

const ServiceTemplatesPage: React.FC<Props> = ({
  innerRoutes,
  match,
  moduleClass,
  tabRoutes,
  tabRoutesDef,
}) => {
  useBreadcrumbs("Templates", match.url);
  return <>{match.isExact ? <ServiceTemplateList /> : innerRoutes}</>;
};

export default ServiceTemplatesPage;
