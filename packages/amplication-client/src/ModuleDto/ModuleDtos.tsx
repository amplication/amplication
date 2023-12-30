import React from "react";

import { match } from "react-router-dom";
import { AppRouteProps } from "../routes/routesUtil";
import ModuleDtoList from "./ModuleDtoList";
import "./ModuleDtos.scss";
import NewModuleDto from "./NewModuleDto";

type Props = AppRouteProps & {
  match: match<{
    resource: string;
    module?: string;
  }>;
};
const ModuleDtos = React.memo(({ match }: Props) => {
  const { module: moduleId, resource: resourceId } = match.params;

  return (
    <>
      <NewModuleDto moduleId={moduleId} resourceId={resourceId} />
      <ModuleDtoList moduleId={moduleId} resourceId={resourceId} />
    </>
  );
});

export default ModuleDtos;
