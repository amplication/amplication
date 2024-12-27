import React, { useMemo } from "react";

import { TabItem } from "@amplication/ui/design-system";
import { match } from "react-router-dom";
import InnerPageLayout from "../Layout/InnerPageLayout";
import useTabRoutes from "../Layout/useTabRoutes";
import { AppRouteProps } from "../routes/routesUtil";
import WorkspaceForm from "./WorkspaceForm";
import PageContent from "../Layout/PageContent";
import InnerTabLink from "../Layout/InnerTabLink";

const OVERVIEW = "General";

type Props = AppRouteProps & {
  match: match<{
    workspace: string;
  }>;
};

const WorkspaceSettingsPage: React.FC<Props> = ({
  match,
  tabRoutes,
  tabRoutesDef,
}) => {
  const { tabs } = useTabRoutes(tabRoutesDef);

  const tabItems: TabItem[] = useMemo(() => {
    return [
      {
        name: OVERVIEW,
        to: match.url,
        exact: true,
      },
      ...(tabs || []),
    ];
  }, [tabs, match.url]);

  return (
    <PageContent
      pageTitle={"Settings"}
      sideContent={
        <>
          {tabItems.map((tab) => (
            <InnerTabLink to={tab.to} icon="app-settings" exact={tab.exact}>
              {tab.name}
            </InnerTabLink>
          ))}
        </>
      }
    >
      {match.isExact ? (
        <>
          <WorkspaceForm />
        </>
      ) : (
        tabRoutes
      )}
    </PageContent>
  );
};

export default WorkspaceSettingsPage;
