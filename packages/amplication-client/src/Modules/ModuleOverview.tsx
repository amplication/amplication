import React from "react";

import { NavLink, match } from "react-router-dom";
import { Button, EnumButtonStyle } from "../Components/Button";
import ModuleActionsAndTypes from "../ModuleActions/ModuleActionsAndTypes";
import { useAppContext } from "../context/appContext";
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
  const { currentWorkspace, currentProject, currentResource } = useAppContext();

  const { module: moduleId } = match.params;
  const { getModuleData: moduleData } = useModule(moduleId);

  const { searchPhrase, displayMode, customActionsLicenseEnabled } =
    useModulesContext();

  const moduleUrl = `/${currentWorkspace?.id}/${currentProject?.id}/${currentResource?.id}/modules/${moduleId}/edit`;

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
                actions={
                  <NavLink to={moduleUrl}>
                    <Button buttonStyle={EnumButtonStyle.Primary} icon="edit">
                      Edit Module
                    </Button>
                  </NavLink>
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
