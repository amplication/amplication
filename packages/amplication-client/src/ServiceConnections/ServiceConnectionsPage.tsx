import React from "react";
import { match } from "react-router-dom";
import PageContent from "../Layout/PageContent";
import { AppRouteProps } from "../routes/routesUtil";
import { ServiceConnectionsList } from "./ServiceConnectionsList";

type Props = AppRouteProps & {
  match: match<{
    resource: string;
  }>;
};

const pageTitle = "Topics";

const TopicsPage: React.FC<Props> = ({ match, innerRoutes }: Props) => {
  const { resource } = match.params;

  return (
    <PageContent
      pageTitle={pageTitle}
      className="topics"
      sideContent={
        <ServiceConnectionsList
          resourceId={resource}
        />
      }
    >
      connection details
      {innerRoutes}
    </PageContent>
  );
};

export default TopicsPage;
