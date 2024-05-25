import { EnumApiOperationTagStyle } from "@amplication/ui/design-system";
import { BillingFeature } from "@amplication/util-billing-types";
import { useQuery } from "@apollo/client";
import { useStiggContext } from "@stigg/react-sdk";
import React, { useEffect, useState } from "react";
import { match, useRouteMatch } from "react-router-dom";
import {
  EntitlementType,
  FeatureIndicatorContainer,
} from "../Components/FeatureIndicatorContainer";
import { PremiumFeatureHeader } from "../Components/PremiumFeatureHeader";
import PageContent from "../Layout/PageContent";
import { GET_RESOURCE_SETTINGS } from "../Resource/resourceSettings/GenerationSettingsForm";
import * as models from "../models";
import { AppRouteProps } from "../routes/routesUtil";
import ModuleList from "./ModuleList";
import ModuleNavigationList from "./ModuleNavigationList";
import ModulesHeader from "./ModulesHeader";
import ModulesToolbar from "./ModulesToolbar";
import NewModule from "./NewModule";
import {
  ModulesContextInterface,
  ModulesContextProvider,
} from "./modulesContext";

type Props = AppRouteProps & {
  match: match<{
    resource: string;
  }>;
};

const ModulesPage: React.FC<Props> = ({
  match,
  innerRoutes,
  ...rest
}: Props) => {
  const { resource } = match.params;

  const moduleMatch = useRouteMatch<{
    resource: string;
    module: string;
  }>("/:workspace/:project/:resource/modules/:module");

  const { module: moduleId } = moduleMatch?.params ?? {};

  const { stigg } = useStiggContext();

  const customActionsEnabled = stigg.getBooleanEntitlement({
    featureId: BillingFeature.CustomActions,
  }).hasAccess;

  const [searchPhrase, setSearchPhrase] = useState<string>("");

  const [displayMode, setDisplayMode] = useState<EnumApiOperationTagStyle>(
    EnumApiOperationTagStyle.REST
  );

  const { data } = useQuery<{
    serviceSettings: models.ServiceSettings;
  }>(GET_RESOURCE_SETTINGS, {
    variables: {
      id: resource,
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

  const context: ModulesContextInterface = {
    searchPhrase,
    displayMode,
    setSearchPhrase,
    setDisplayMode,
    graphQlEnabled: data?.serviceSettings.serverSettings.generateGraphQL,
    restEnabled: data?.serviceSettings.serverSettings.generateRestApi,
    customActionsLicenseEnabled: customActionsEnabled,
  };

  return (
    <PageContent
      pageTitle={"APIs"}
      sideContent={<ModuleNavigationList resourceId={resource} />}
    >
      <FeatureIndicatorContainer
        featureId={BillingFeature.CustomActions}
        entitlementType={EntitlementType.Boolean}
        render={({ disabled, icon }) => (
          <>
            {disabled && (
              <PremiumFeatureHeader
                title={"Unlock your APIs Full Potential"}
                message={
                  "Maximize the power of your APIs and Types through seamless management and customization as a unified source of truth."
                }
              />
            )}
          </>
        )}
      />

      <ModulesContextProvider newVal={context}>
        <ModulesToolbar resourceId={resource} moduleId={moduleId} />
        {match.isExact ? (
          <>
            <ModulesHeader
              title={"All Modules"}
              subTitle={"Select a module to view its Actions and DTOs"}
              hideApiToggle
              actions={<NewModule resourceId={resource} />}
            />

            <ModuleList />
          </>
        ) : (
          innerRoutes
        )}
      </ModulesContextProvider>
    </PageContent>
  );
};

export default ModulesPage;
