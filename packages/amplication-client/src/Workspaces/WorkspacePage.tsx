import { TabItem } from "@amplication/ui/design-system";
import React from "react";
import { match } from "react-router-dom";
import Catalog from "../Catalog/Catalog";
import PageLayout from "../Layout/PageLayout";
import useTabRoutes from "../Layout/useTabRoutes";
import { AppRouteProps } from "../routes/routesUtil";

type Props = AppRouteProps & {
  match: match<{
    workspace: string;
    project: string;
  }>;
};

const WorkspacePage: React.FC<Props> = ({
  innerRoutes,
  match,
  moduleClass,
  tabRoutes,
  tabRoutesDef,
}) => {
  const { tabs, currentRouteIsTab } = useTabRoutes(tabRoutesDef);

  const tabItems: TabItem[] = [
    { name: "Workspace Catalog", to: match.url, exact: true },
    ...tabs,
  ];

  return (
    <>
      {match.isExact || currentRouteIsTab ? (
        <>
          <PageLayout className={moduleClass} tabs={tabItems}>
            {match.isExact ? <Catalog /> : tabRoutes}
          </PageLayout>
        </>
      ) : (
        innerRoutes
      )}
    </>
  );
};

export default WorkspacePage;
