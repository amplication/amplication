import { EnumApiOperationTagStyle } from "@amplication/ui/design-system";
import React from "react";

import { match } from "react-router-dom";
import useModule from "../Modules/hooks/useModule";
import { AppRouteProps } from "../routes/routesUtil";
import ModuleActionList from "./ModuleActionList";
import "./ToggleModule.scss";
import { useModulesContext } from "../Modules/modulesContext";

type Props = AppRouteProps & {
  match: match<{
    resource: string;
    module?: string;
  }>;
};
const ModuleActions = React.memo(({ match }: Props) => {
  const { module: moduleId } = match.params;

  const { getModuleData: moduleData } = useModule(moduleId);
  const { searchPhrase, displayMode, customActionsLicenseEnabled } =
    useModulesContext();

  return (
    moduleData && (
      <ModuleActionList
        module={moduleData?.module}
        searchPhrase={searchPhrase}
        displayMode={displayMode}
        disabled={!customActionsLicenseEnabled}
      />
    )
  );
});

export default ModuleActions;
