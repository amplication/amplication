import React from "react";
import { match } from "react-router-dom";
import PageContent from "../../Layout/PageContent";
import { AppRouteProps } from "../../routes/routesUtil";
import { PackageList } from "./PackageList";
import PackagesToolbar from "./PackagesToolbar";

type Props = AppRouteProps & {
  match: match<{
    resource: string;
  }>;
};

const PackagesPage: React.FC<Props> = ({ match, innerRoutes }: Props) => {
  const { resource } = match.params;
  const pageTitle = "Packages";

  return (
    <PageContent
      pageTitle={pageTitle}
      sideContent={<PackageList resourceId={resource} />}
    >
      <PackagesToolbar />

      {innerRoutes}
    </PageContent>
  );
};

export default PackagesPage;
