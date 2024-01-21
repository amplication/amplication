import { EnumApiOperationTagStyle } from "@amplication/ui/design-system";
import React, { useCallback, useEffect, useState } from "react";

import { BillingFeature } from "@amplication/util-billing-types";
import { useQuery } from "@apollo/client";
import { match } from "react-router-dom";
import {
  EntitlementType,
  FeatureIndicatorContainer,
} from "../Components/FeatureIndicatorContainer";
import useModule from "../Modules/hooks/useModule";
import { GET_RESOURCE_SETTINGS } from "../Resource/resourceSettings/GenerationSettingsForm";
import * as models from "../models";
import { AppRouteProps } from "../routes/routesUtil";
import "./ModuleActions.scss";
import ModuleActionsAndTypes from "./ModuleActionsAndTypes";
import ModuleHeader from "./ModuleHeader";
import "./ToggleModule.scss";

type Props = AppRouteProps & {
  match: match<{
    resource: string;
    module?: string;
  }>;
};
const ModuleActions = React.memo(({ match }: Props) => {
  const { module: moduleId, resource: resourceId } = match.params;
  const [searchPhrase, setSearchPhrase] = useState<string>("");

  const { getModuleData: moduleData } = useModule(moduleId);

  const [displayMode, setDisplayMode] = useState<EnumApiOperationTagStyle>(
    EnumApiOperationTagStyle.REST
  );

  const { data } = useQuery<{
    serviceSettings: models.ServiceSettings;
  }>(GET_RESOURCE_SETTINGS, {
    variables: {
      id: resourceId,
    },
  });

  useEffect(() => {
    if (!data) return;
    if (data.serviceSettings.serverSettings.generateRestApi) {
      setDisplayMode(EnumApiOperationTagStyle.REST);
      return;
    }

    if (data.serviceSettings.serverSettings.generateGraphQL) {
      setDisplayMode(EnumApiOperationTagStyle.GQL);
    }
  }, [setDisplayMode, data]);

  let timeout;

  const handleSearchChange = useCallback(
    (value) => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        setSearchPhrase(value);
      }, 750);
    },
    [setSearchPhrase, timeout]
  );

  const handleDisplayModeChange = useCallback(
    (checked: boolean) => {
      const value = checked
        ? EnumApiOperationTagStyle.REST
        : EnumApiOperationTagStyle.GQL;

      setDisplayMode(value);
    },
    [setDisplayMode]
  );

  const { findModulesData: moduleListData } = useModule();
  const generateGraphQlAndRestApi =
    data?.serviceSettings?.serverSettings?.generateRestApi &&
    data?.serviceSettings?.serverSettings?.generateGraphQL;

  return (
    <FeatureIndicatorContainer
      featureId={BillingFeature.CustomActions}
      entitlementType={EntitlementType.Boolean}
      render={({ disabled, icon }) => (
        <>
          <ModuleHeader
            handleSearchChange={handleSearchChange}
            handleDisplayModeChange={handleDisplayModeChange}
            showApiToggle={generateGraphQlAndRestApi}
            displayMode={displayMode}
            title={moduleData?.module.displayName || "All Modules"}
            subTitle={"Create, update, and manage actions and types"}
          />

          {moduleId
            ? moduleData && (
                <ModuleActionsAndTypes
                  module={moduleData?.module}
                  searchPhrase={searchPhrase}
                  displayMode={displayMode}
                  disabled={disabled}
                />
              )
            : moduleListData?.modules.map((module) => (
                <ModuleActionsAndTypes
                  key={module.id}
                  module={module}
                  searchPhrase={searchPhrase}
                  displayMode={displayMode}
                  disabled={disabled}
                />
              ))}
        </>
      )}
    />
  );
});

export default ModuleActions;
