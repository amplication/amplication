import React from "react";

import { match } from "react-router-dom";
import ModulesHeader from "../Modules/ModulesHeader";
import useModule from "../Modules/hooks/useModule";
import { useModulesContext } from "../Modules/modulesContext";
import { AppRouteProps } from "../routes/routesUtil";
import ModuleActionList from "./ModuleActionList";
import NewModuleAction from "./NewModuleAction";
import {
  EnumButtonStyle,
  EnumFlexItemMargin,
  EnumItemsAlign,
  EnumTextStyle,
  FlexItem,
  Text,
} from "@amplication/ui/design-system";

type Props = AppRouteProps & {
  match: match<{
    resource: string;
    module?: string;
  }>;
};
const ModuleActions = React.memo(({ match, innerRoutes }: Props) => {
  const { module: moduleId, resource: resourceId } = match.params;

  const { getModuleData: moduleData } = useModule(moduleId);
  const { searchPhrase, displayMode, customActionsLicenseEnabled } =
    useModulesContext();

  return match.isExact
    ? moduleData && (
        <>
          <ModulesHeader
            title={`${moduleData?.module.displayName} Actions `}
            subTitle={
              moduleData?.module.description ||
              "Create, update, and manage actions and types"
            }
          />
          <FlexItem
            margin={EnumFlexItemMargin.Both}
            itemsAlign={EnumItemsAlign.Center}
          >
            <Text textStyle={EnumTextStyle.H4}>Actions</Text>
          </FlexItem>
          <ModuleActionList
            module={moduleData?.module}
            searchPhrase={searchPhrase}
            displayMode={displayMode}
            disabled={!customActionsLicenseEnabled}
          />
        </>
      )
    : innerRoutes;
});

export default ModuleActions;
