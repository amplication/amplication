import {
  EnumApiOperationTagStyle,
  EnumFlexItemMargin,
  FlexItem,
} from "@amplication/ui/design-system";
import React, { useCallback, useEffect, useState } from "react";

import { useQuery } from "@apollo/client";
import { match } from "react-router-dom";
import useModule from "../Modules/hooks/useModule";
import { GET_RESOURCE_SETTINGS } from "../Resource/resourceSettings/GenerationSettingsForm";
import * as models from "../models";
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
