import React from "react";

import { match } from "react-router-dom";
import ModuleActionsAndTypes from "../ModuleActions/ModuleActionsAndTypes";
import { AppRouteProps } from "../routes/routesUtil";
import ModulesHeader from "./ModulesHeader";
import useModule from "./hooks/useModule";
import { useModulesContext } from "./modulesContext";

type Props = AppRouteProps & {
  match: match<{
    resource: string;
    module?: string;
  }>;
};
const ModuleOverview = React.memo(({ match, innerRoutes }: Props) => {
  const { module: moduleId } = match.params;
  const { getModuleData: moduleData } = useModule(moduleId);

  const { searchPhrase, displayMode, customActionsLicenseEnabled } =
    useModulesContext();

  return (
    <>
      {match.isExact
        ? moduleData && (
            <>
              <ModulesHeader
                title={moduleData?.module.displayName}
                subTitle={
                  moduleData?.module.description ||
                  "Create, update, and manage actions and types"
                }
              />

              <ModuleActionsAndTypes
                module={moduleData?.module}
                searchPhrase={searchPhrase}
                displayMode={displayMode}
                disabled={!customActionsLicenseEnabled}
              />
            </>
          )
        : innerRoutes}
    </>
  );
});

export default ModuleOverview;
