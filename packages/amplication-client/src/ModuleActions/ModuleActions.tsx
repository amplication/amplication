import {
  EnumApiOperationTagStyle,
  EnumContentAlign,
  EnumFlexDirection,
  EnumFlexItemMargin,
  EnumItemsAlign,
  FlexItem,
  Icon,
  SearchField,
  TabContentTitle,
  Toggle,
  Text,
  EnumTextStyle,
  EnumTextColor,
  EnumTextWeight,
} from "@amplication/ui/design-system";
import React, { useCallback, useEffect, useState } from "react";

import { match } from "react-router-dom";
import { AppRouteProps } from "../routes/routesUtil";
import ModuleActionList from "./ModuleActionList";
import NewModuleAction from "./NewModuleAction";
import useModule from "../Modules/hooks/useModule";
import * as models from "../models";
import { useQuery } from "@apollo/client";
import { GET_RESOURCE_SETTINGS } from "../Resource/resourceSettings/GenerationSettingsForm";
import "./ToggleModule.scss";
import {
  EntitlementType,
  FeatureIndicatorContainer,
} from "../Components/FeatureIndicatorContainer";
import { BillingFeature } from "@amplication/util-billing-types";
import "./ModuleActions.scss";
import { ModuleActionsEnabled } from "./ModuleActionsEnabled";
import { ModuleActionsDisabled } from "./ModuleActionsDisabled";

const DATE_CREATED_FIELD = "createdAt";
const CLASS_NAME = "module-actions";

type Props = AppRouteProps & {
  match: match<{
    resource: string;
    module?: string;
  }>;
};
const ModuleActions = React.memo(({ match }: Props) => {
  const { module: moduleId, resource: resourceId } = match.params;
  const [searchPhrase, setSearchPhrase] = useState<string>("");
  const [error, setError] = useState<Error>();

  const [displayMode, setDisplayMode] = useState<EnumApiOperationTagStyle>(
    EnumApiOperationTagStyle.REST
  );

  const { data, error: serviceSettingsError } = useQuery<{
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
    [displayMode]
  );

  const { findModulesData: moduleListData } = useModule();
  const generateGraphQlAndRestApi =
    data?.serviceSettings?.serverSettings?.generateRestApi &&
    data?.serviceSettings?.serverSettings?.generateGraphQL;

  return (
    <FeatureIndicatorContainer
      featureId={BillingFeature.CustomActions}
      entitlementType={EntitlementType.Boolean}
      showTooltip={false}
      render={({ disabled, icon }) => (
        <>
          {disabled ? (
            <ModuleActionsDisabled
              icon={icon}
              handleSearchChange={handleSearchChange}
              className={CLASS_NAME}
            />
          ) : (
            <ModuleActionsEnabled
              icon={icon}
              handleSearchChange={handleSearchChange}
              className={CLASS_NAME}
            />
          )}

          {generateGraphQlAndRestApi && (
            <FlexItem
              direction={EnumFlexDirection.Row}
              className={`${CLASS_NAME}__api-toggle`}
              margin={EnumFlexItemMargin.Top}
              contentAlign={
                disabled ? EnumContentAlign.Center : EnumContentAlign.Start
              }
              itemsAlign={EnumItemsAlign.Normal}
            >
              <Text
                textStyle={EnumTextStyle.Tag}
                textColor={
                  displayMode === EnumApiOperationTagStyle.GQL
                    ? EnumTextColor.White
                    : EnumTextColor.Black20
                }
              >
                GraphQL API
              </Text>
              <div className={`module-toggle-field__operation-toggle`}>
                <Toggle
                  checked={displayMode === EnumApiOperationTagStyle.REST}
                  onValueChange={handleDisplayModeChange}
                />
              </div>
              <Text
                textStyle={EnumTextStyle.Tag}
                textColor={
                  displayMode === EnumApiOperationTagStyle.REST
                    ? EnumTextColor.White
                    : EnumTextColor.Black20
                }
              >
                REST API
              </Text>
            </FlexItem>
          )}

          {moduleId ? (
            <FlexItem margin={EnumFlexItemMargin.Top}>
              <ModuleActionList
                moduleId={moduleId}
                resourceId={resourceId}
                searchPhrase={searchPhrase}
                displayMode={displayMode}
                disabled={disabled}
              />
            </FlexItem>
          ) : (
            moduleListData?.modules.map((module) => (
              <FlexItem key={module.id} margin={EnumFlexItemMargin.Top}>
                <ModuleActionList
                  moduleId={module.id}
                  resourceId={resourceId}
                  searchPhrase={searchPhrase}
                  displayMode={displayMode}
                  disabled={disabled}
                />
              </FlexItem>
            ))
          )}
        </>
      )}
    />
  );
});

export default ModuleActions;
