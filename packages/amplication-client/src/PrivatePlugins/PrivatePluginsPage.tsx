import { TabItem } from "@amplication/ui/design-system";
import { BillingFeature } from "@amplication/util-billing-types";
import { useStiggContext } from "@stigg/react-sdk";
import React, { useEffect } from "react";
import { match, useHistory, useRouteMatch } from "react-router-dom";
import { useAppContext } from "../context/appContext";
import PageContent from "../Layout/PageContent";
import PageLayout from "../Layout/PageLayout";
import useTabRoutes from "../Layout/useTabRoutes";
import PrivatePluginFeature from "../Plugins/PrivatePluginsFeature";
import { AppRouteProps } from "../routes/routesUtil";
import { useProjectBaseUrl } from "../util/useProjectBaseUrl";
import PrivatePlugin from "./PrivatePlugin";
import { PrivatePluginList } from "./PrivatePluginList";

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

  const { baseUrl } = useProjectBaseUrl({ overrideIsPlatformConsole: true });

  const { tabs } = useTabRoutes(tabRoutesDef);

  const tabItems: TabItem[] = [
    { name: "Plugins", to: match.url, exact: true },
    ...tabs,
  ];

  const { stigg } = useStiggContext();
  const { hasAccess: canUsePrivatePlugins } = stigg.getBooleanEntitlement({
    featureId: BillingFeature.PrivatePlugins,
  });
  const pageTitle = "Private Plugins";

  const privatePluginMatch = useRouteMatch<{ privatePluginId: string }>([
    "/:workspace/platform/:project/private-plugins/git-settings",
    "/:workspace/platform/:project/private-plugins/:privatePluginId",
  ]);

  let privatePluginId = null;
  if (privatePluginMatch) {
    privatePluginId = privatePluginMatch.params.privatePluginId;
  }

  useEffect(() => {
    if (loadingResources || !projectConfigurationResource) return;
    if (!pluginRepositoryResource) {
      history.push(`${baseUrl}/create-plugin-repository`);
    }
  }, [
    baseUrl,
    history,
    loadingResources,
    pluginRepositoryResource,
    projectConfigurationResource,
  ]);

  if (!canUsePrivatePlugins) {
    return (
      <PageContent pageTitle={pageTitle} className="privatePlugins">
        <PrivatePluginFeature />
      </PageContent>
    );
  }

  return (
    <PageLayout tabs={tabItems}>
      {match.isExact || privatePluginId ? (
        <PageContent
          pageTitle={pageTitle}
          sideContent={
            <PrivatePluginList selectFirst={null === privatePluginId} />
          }
        >
          {privatePluginId && <PrivatePlugin />}
        </PageContent>
      ) : (
        tabRoutes
      )}
    </PageLayout>
  );
};

export default PrivatePluginsPage;
