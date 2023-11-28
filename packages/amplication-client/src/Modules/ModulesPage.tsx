import React, { useContext } from "react";
import { match } from "react-router-dom";
import PageContent from "../Layout/PageContent";
import { AppContext } from "../context/appContext";
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
  const { currentWorkspace, currentProject, currentResource } =
    useContext(AppContext);

  const resourceId = currentResource?.id;
  const moduleId = "TODO";

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
