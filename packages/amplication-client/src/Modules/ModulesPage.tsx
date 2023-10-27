import React, { useContext } from "react";
import { match } from "react-router-dom";
import { AppRouteProps } from "../routes/routesUtil";
import ModuleList from "./ModuleList";
import PageContent from "../Layout/PageContent";
import InnerTabLink from "../Layout/InnerTabLink";
import { AppContext } from "../context/appContext";
import { ModuleActionLinkList } from "../ModuleActions/ModuleActionLinkList";
import Module from "./Module";

type Props = AppRouteProps & {
  match: match<{
    resource: string;
  }>;
};

const ModulesPage: React.FC<Props> = ({ match, innerRoutes }: Props) => {
  const { resource } = match.params;
  const { currentWorkspace, currentProject, currentResource } =
    useContext(AppContext);

  const resourceId = currentResource?.id;
  const moduleId = "TODO";

  return (
    <PageContent
      pageTitle={"Modules"}
      sideContent={<ModuleList resourceId={resource} />}
    >
      {match.isExact ? <Module /> : innerRoutes}
    </PageContent>
  );
  // return match.isExact ? <ModuleList resourceId={resource} /> : innerRoutes;
};

export default ModulesPage;
