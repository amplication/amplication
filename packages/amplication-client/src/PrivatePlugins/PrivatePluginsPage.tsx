import React, { useEffect } from "react";
import { match, useRouteMatch, useHistory } from "react-router-dom";
import { isEmpty } from "lodash";
import PageContent from "../Layout/PageContent";
import PrivatePlugin from "./PrivatePlugin";
import { PrivatePluginList } from "./PrivatePluginList";
import { AppRouteProps } from "../routes/routesUtil";
import { useAppContext } from "../context/appContext";
import useBreadcrumbs from "../Layout/useBreadcrumbs";

type Props = AppRouteProps & {
  match: match<{
    resource: string;
  }>;
};

const PrivatePluginsPage: React.FC<Props> = ({ match, innerRoutes }: Props) => {
  const {
    pluginRepositoryResource,
    loadingResources,
    currentWorkspace,
    currentProject,
  } = useAppContext();
  const history = useHistory();

  const pageTitle = "Private Plugins";
  useBreadcrumbs(pageTitle, match.url);

  const privatePluginMatch = useRouteMatch<{ privatePluginId: string }>(
    "/:workspace/platform/:project/private-plugins/:privatePluginId"
  );

  let privatePluginId = null;
  if (privatePluginMatch) {
    privatePluginId = privatePluginMatch.params.privatePluginId;
  }

  useEffect(() => {
    if (loadingResources) return;
    if (!pluginRepositoryResource) {
      history.push(
        `/${currentWorkspace?.id}/${currentProject?.id}/create-plugin-repository`
      );
    }
  }, [
    currentProject?.id,
    currentWorkspace?.id,
    history,
    loadingResources,
    pluginRepositoryResource,
  ]);

  return (
    <PageContent
      pageTitle={pageTitle}
      className="privatePlugins"
      sideContent={<PrivatePluginList selectFirst={null === privatePluginId} />}
    >
      {match.isExact
        ? !isEmpty(privatePluginId) && (
            <PrivatePlugin
              pluginRepositoryResourceId={pluginRepositoryResource?.id}
            />
          )
        : innerRoutes}
    </PageContent>
  );
};

export default PrivatePluginsPage;
