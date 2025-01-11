import React from "react";

import { match } from "react-router-dom";
import { useModulesContext } from "../Modules/modulesContext";
import { AppRouteProps } from "../routes/routesUtil";
import ModuleDtoList from "./ModuleDtoList";
import "./ModuleDtos.scss";
import ModulesHeader from "../Modules/ModulesHeader";
import useModule from "../Modules/hooks/useModule";
import NewModuleDto from "./NewModuleDto";
import NewModuleDtoEnum from "./NewModuleDtoEnum";
import {
  EnumFlexItemMargin,
  EnumTextStyle,
  FlexItem,
  Text,
  EnumFlexDirection,
  EnumButtonStyle,
} from "@amplication/ui/design-system";

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
        title={`${moduleData?.module.displayName} DTOs `}
        subTitle={
          moduleData?.module.description ||
          "Create, update, and manage actions and types"
        }
      />
      <FlexItem margin={EnumFlexItemMargin.Both}>
        <Text textStyle={EnumTextStyle.H4}>DTOs</Text>
      </FlexItem>
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
