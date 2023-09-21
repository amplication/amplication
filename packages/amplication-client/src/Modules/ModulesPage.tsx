import React from "react";
import { match, useRouteMatch } from "react-router-dom";
import { isEmpty } from "lodash";
import PageContent from "../Layout/PageContent";
import Module from "./Module";
import { ModuleList } from "./ModuleList";
import { AppRouteProps } from "../routes/routesUtil";

type Props = AppRouteProps & {
  match: match<{
    resource: string;
  }>;
};

const ModulesPage: React.FC<Props> = ({ match, innerRoutes }: Props) => {
  const { resource } = match.params;
  const pageTitle = "Modules";

  const moduleMatch = useRouteMatch<{ moduleId: string }>(
    "/:workspace/:project/:resource/modules/:moduleId"
  );

  let moduleId = null;
  if (moduleMatch) {
    moduleId = moduleMatch.params.moduleId;
  }

  return (
    <PageContent
      pageTitle={pageTitle}
      className="modules"
      sideContent={
        <ModuleList resourceId={resource} selectFirst={null === moduleId} />
      }
    >
      {match.isExact ? !isEmpty(moduleId) && <Module /> : innerRoutes}
    </PageContent>
  );
};

export default ModulesPage;
