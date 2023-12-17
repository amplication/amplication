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
import { FeatureIndicator } from "../Components/FeatureIndicator";

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
      render={({ disabled, icon }) => (
        <>
          {disabled && (
            <FlexItem
              direction={EnumFlexDirection.Column}
              itemsAlign={EnumItemsAlign.Center}
              className={`${CLASS_NAME}__addon-section`}
            >
              <div className={`${CLASS_NAME}__feature-tag`}>
                <Text
                  textStyle={EnumTextStyle.Tag}
                  textColor={EnumTextColor.Black}
                >
                  Premium feature
                </Text>
                <Icon icon={icon} size={"xsmall"} color={EnumTextColor.Black} />
              </div>
              <Text
                textStyle={EnumTextStyle.H2}
                textWeight={EnumTextWeight.Bold}
                className={`${CLASS_NAME}__addon-section__title`}
              >
                Unlock your APIs Full Potential
              </Text>
              <Text
                textWeight={EnumTextWeight.Regular}
                textColor={EnumTextColor.Black20}
              >
                Maximize the power of your APIs and Types through seamless
                management
              </Text>
              <Text
                textWeight={EnumTextWeight.Regular}
                textColor={EnumTextColor.Black20}
              >
                and customization as a unified source of truth.{" "}
                <a
                  className={`${CLASS_NAME}__addon-section__contact-us`}
                  href={"https://meetings-eu1.hubspot.com/liza-dymava/cta-link"}
                  target="blank"
                >
                  <Text>{"Contact us"}</Text>{" "}
                </a>
                for more information
              </Text>
            </FlexItem>
          )}

          {!disabled && (
            <>
              <div className={`${CLASS_NAME}__search-field`}>
                <SearchField
                  label="search"
                  placeholder="Search"
                  onChange={handleSearchChange}
                />
              </div>
              <FlexItem
                itemsAlign={EnumItemsAlign.Start}
                margin={EnumFlexItemMargin.Top}
                start={
                  <TabContentTitle
                    title="Module Actions"
                    subTitle="Actions are used to perform operations on resources, with or without API endpoints."
                  />
                }
                end={
                  <FeatureIndicator
                    featureName={BillingFeature.CustomActions}
                    placement="bottom-end"
                    text="The Custom Actions feature is exclusive to the Enterprise plan."
                    icon={icon}
                    element={
                      <div className={`${CLASS_NAME}__feature-tag`}>
                        <Text
                          textStyle={EnumTextStyle.Tag}
                          textColor={EnumTextColor.Black}
                        >
                          Premium feature
                        </Text>
                        <Icon
                          icon={icon}
                          size={"xsmall"}
                          color={EnumTextColor.Black}
                        />
                      </div>
                    }
                  />
                }
              ></FlexItem>
            </>
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
            moduleListData?.Modules.map((module) => (
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
