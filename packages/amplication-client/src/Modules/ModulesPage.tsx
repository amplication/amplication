import React, { useContext } from "react";
import { match } from "react-router-dom";
import PageContent from "../Layout/PageContent";
import { AppContext } from "../context/appContext";
import { AppRouteProps } from "../routes/routesUtil";
import Module from "./Module";
import ModuleList from "./ModuleList";
import ModuleActions from "../ModuleActions/ModuleActions";

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
      {match.isExact ? (
        <ModuleActions match={match} {...rest} innerRoutes={innerRoutes} />
      ) : (
        innerRoutes
      )}
    </PageContent>
  );
};

export default ModulesPage;
