import React from "react";

import { match } from "react-router-dom";
import { useModulesContext } from "../Modules/modulesContext";
import { AppRouteProps } from "../routes/routesUtil";
import ModuleDtoList from "./ModuleDtoList";
import "./ModuleDtos.scss";
import ModulesHeader from "../Modules/ModulesHeader";
import useModule from "../Modules/hooks/useModule";

type Props = AppRouteProps & {
  match: match<{
    resource: string;
    module?: string;
  }>;
};
const ModuleDtos = React.memo(({ match, innerRoutes }: Props) => {
  const { module: moduleId, resource: resourceId } = match.params;

  const { getModuleData: moduleData } = useModule(moduleId);
  const { searchPhrase, customActionsLicenseEnabled } = useModulesContext();

  return match.isExact ? (
    <>
      <ModulesHeader
        hideApiToggle
        title={moduleData?.module.displayName}
        subTitle={
          moduleData?.module.description ||
          "Create, update, and manage actions and types"
        }
      />

      <ModuleDtoList
        moduleId={moduleId}
        resourceId={resourceId}
        searchPhrase={searchPhrase}
        disabled={!customActionsLicenseEnabled}
      />
    </>
  ) : (
    innerRoutes
  );
});

export default ModuleDtos;
