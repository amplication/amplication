import React from "react";
import { match } from "react-router-dom";
import PageContent from "../Layout/PageContent";
import { AppRouteProps } from "../routes/routesUtil";
import ModuleList from "./ModuleList";

type Props = AppRouteProps & {
  match: match<{
    resource: string;
  }>;
};

const ModulesPage: React.FC<Props> = ({
  match,
  innerRoutes,
  ...rest
}: Props) => {
  const { resource } = match.params;

  return (
    <PageContent
      pageTitle={"Modules"}
      sideContent={<ModuleList resourceId={resource} />}
    >
      {innerRoutes}
    </PageContent>
  );
};

export default ModulesPage;
