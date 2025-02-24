import React from "react";
import { match, useRouteMatch } from "react-router-dom";
import PageContent from "../Layout/PageContent";
import { AppRouteProps } from "../routes/routesUtil";
import { PrivatePluginList } from "./PrivatePluginList";

type Props = AppRouteProps & {
  match: match<{
    resource: string;
  }>;
};

const PrivatePluginsListPage: React.FC<Props> = ({
  match,
  innerRoutes,
  tabRoutesDef,
  tabRoutes,
}: Props) => {
  const pageTitle = "Private Plugins";

  const privatePluginMatch = useRouteMatch<{ privatePluginId: string }>([
    "/:workspace/platform/:project/private-plugins/list/:privatePluginId",
  ]);

  let privatePluginId = null;
  if (privatePluginMatch) {
    privatePluginId = privatePluginMatch.params.privatePluginId;
  }

  return (
    <PageContent
      pageTitle={pageTitle}
      sideContent={<PrivatePluginList selectFirst={!privatePluginId} />}
    >
      {innerRoutes}
    </PageContent>
  );
};

export default PrivatePluginsListPage;
