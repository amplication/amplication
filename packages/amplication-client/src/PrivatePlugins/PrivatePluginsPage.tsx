import { BillingFeature } from "@amplication/util-billing-types";
import { useStiggContext } from "@stigg/react-sdk";
import React, { useEffect } from "react";
import { match, useHistory } from "react-router-dom";
import { useAppContext } from "../context/appContext";
import PageContent from "../Layout/PageContent";
import PageLayout from "../Layout/PageLayout";
import useTabRoutes from "../Layout/useTabRoutes";
import PrivatePluginFeature from "../Plugins/PrivatePluginsFeature";
import { AppRouteProps } from "../routes/routesUtil";
import { useProjectBaseUrl } from "../util/useProjectBaseUrl";
import useBreadcrumbs from "../Layout/useBreadcrumbs";
type Props = AppRouteProps & {
  match: match<{
    resource: string;
  }>;
};

const PrivatePluginsPage: React.FC<Props> = ({
  match,
  innerRoutes,
  tabRoutesDef,
  tabRoutes,
}: Props) => {
  const {
    pluginRepositoryResource,
    loadingResources,
    projectConfigurationResource,
  } = useAppContext();
  const history = useHistory();
  useBreadcrumbs("Plugin Repository", match.url);

  const { baseUrl } = useProjectBaseUrl({ overrideIsPlatformConsole: true });

  const { tabs } = useTabRoutes(tabRoutesDef);

  const { stigg } = useStiggContext();
  const { hasAccess: canUsePrivatePlugins } = stigg.getBooleanEntitlement({
    featureId: BillingFeature.PrivatePlugins,
  });
  const pageTitle = "Private Plugins";

  useEffect(() => {
    if (loadingResources || !projectConfigurationResource) return;
    if (!pluginRepositoryResource) {
      history.push(`${baseUrl}/create-plugin-repository`);
    } else if (match.isExact) {
      history.push(`${baseUrl}/private-plugins/list`);
    }
  }, [
    baseUrl,
    history,
    loadingResources,
    pluginRepositoryResource,
    projectConfigurationResource,
    match,
  ]);

  if (!canUsePrivatePlugins) {
    return (
      <PageContent pageTitle={pageTitle} className="privatePlugins">
        <PrivatePluginFeature />
      </PageContent>
    );
  }

  return (
    <PageLayout tabs={tabs}>
      <>
        {tabRoutes}
        {innerRoutes}
      </>
    </PageLayout>
  );
};

export default PrivatePluginsPage;
