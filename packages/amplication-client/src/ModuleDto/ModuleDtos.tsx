import React from "react";

import { match } from "react-router-dom";
import { AppRouteProps } from "../routes/routesUtil";
import ModuleDtoList from "./ModuleDtoList";
import "./ModuleDtos.scss";
import NewModuleDto from "./NewModuleDto";
import { useModulesContext } from "../Modules/modulesContext";

type Props = AppRouteProps & {
  match: match<{
    resource: string;
    module?: string;
  }>;
};
const ModuleDtos = React.memo(({ match }: Props) => {
  const { module: moduleId, resource: resourceId } = match.params;

  const { searchPhrase, customActionsLicenseEnabled } = useModulesContext();

  return (
    <>
      <NewModuleDto moduleId={moduleId} resourceId={resourceId} />
      <ModuleDtoList
        moduleId={moduleId}
        resourceId={resourceId}
        searchPhrase={searchPhrase}
        disabled={!customActionsLicenseEnabled}
      />
    </>
  );
});

export default ModuleDtos;
