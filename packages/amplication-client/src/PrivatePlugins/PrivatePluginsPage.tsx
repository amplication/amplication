import React, { useEffect } from "react";
import { match, useRouteMatch, useHistory } from "react-router-dom";
import { isEmpty } from "lodash";
import PageContent from "../Layout/PageContent";
import PrivatePlugin from "./PrivatePlugin";
import { PrivatePluginList } from "./PrivatePluginList";
import { AppRouteProps } from "../routes/routesUtil";
import { useAppContext } from "../context/appContext";
import { useProjectBaseUrl } from "../util/useProjectBaseUrl";
import { BillingFeature } from "@amplication/util-billing-types";
import { useStiggContext } from "@stigg/react-sdk";
import PrivatePluginFeature from "../Plugins/PrivatePluginsFeature";

type Props = AppRouteProps & {
  match: match<{
    resource: string;
  }>;
};

const PrivatePluginsPage: React.FC<Props> = ({ match, innerRoutes }: Props) => {
  const {
    pluginRepositoryResource,
    loadingResources,
    projectConfigurationResource,
  } = useAppContext();
  const history = useHistory();

  const { baseUrl } = useProjectBaseUrl({ overrideIsPlatformConsole: true });

  const { stigg } = useStiggContext();

  const { hasAccess: canUsePrivatePlugins } = stigg.getBooleanEntitlement({
    featureId: BillingFeature.PrivatePlugins,
  });
  const pageTitle = "Private Plugins";

  const privatePluginMatch = useRouteMatch<{ privatePluginId: string }>(
    "/:workspace/platform/:project/private-plugins/:privatePluginId"
  );

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
    <PageContent
      pageTitle={pageTitle}
      className="privatePlugins"
      sideContent={<PrivatePluginList selectFirst={null === privatePluginId} />}
    >
      {!canUsePrivatePlugins ? (
        <PrivatePluginFeature />
      ) : match.isExact ? (
        !isEmpty(privatePluginId) && (
          <PrivatePlugin
            pluginRepositoryResourceId={pluginRepositoryResource?.id}
          />
        )
      ) : (
        innerRoutes
      )}
    </PageContent>
  );
};

export default PrivatePluginsPage;
