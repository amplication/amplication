import React from "react";
import { match } from "react-router-dom";
import PageContent from "../Layout/PageContent";
import { AppRouteProps } from "../routes/routesUtil";
import { PluginTree } from "./PluginTree";

type Props = AppRouteProps & {
  match: match<{
    resource: string;
  }>;
};

const PluginsPage: React.FC<Props> = ({ match, innerRoutes }: Props) => {
  const { resource } = match.params;
  const pageTitle = "Plugins";

  return (
    <PageContent
      pageTitle={pageTitle}
      className="plugins"
      sideContent={<PluginTree resourceId={resource} />}
    >
      {innerRoutes}
    </PageContent>
  );
};

export default PluginsPage;
