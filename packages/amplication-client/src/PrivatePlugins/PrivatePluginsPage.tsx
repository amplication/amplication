import React from "react";
import { match, useRouteMatch } from "react-router-dom";
import { isEmpty } from "lodash";
import PageContent from "../Layout/PageContent";
import PrivatePlugin from "./PrivatePlugin";
import { PrivatePluginList } from "./PrivatePluginList";
import { AppRouteProps } from "../routes/routesUtil";

type Props = AppRouteProps & {
  match: match<{
    resource: string;
  }>;
};

const PrivatePluginsPage: React.FC<Props> = ({ match, innerRoutes }: Props) => {
  const { resource } = match.params;
  const pageTitle = "PrivatePlugins";

  const privatePluginMatch = useRouteMatch<{ privatePluginId: string }>(
    "/:workspace/:project/:resource/private-plugins/:privatePluginId"
  );

  let privatePluginId = null;
  if (privatePluginMatch) {
    privatePluginId = privatePluginMatch.params.privatePluginId;
  }

  return (
    <PageContent
      pageTitle={pageTitle}
      className="privatePlugins"
      sideContent={
        <PrivatePluginList
          resourceId={resource}
          selectFirst={null === privatePluginId}
        />
      }
    >
      {match.isExact
        ? !isEmpty(privatePluginId) && <PrivatePlugin />
        : innerRoutes}
    </PageContent>
  );
};

export default PrivatePluginsPage;
