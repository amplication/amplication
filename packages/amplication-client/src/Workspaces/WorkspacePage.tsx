import React, { useContext } from "react";
import { match } from "react-router-dom";
import PageLayout from "../Layout/PageLayout";
import useBreadcrumbs from "../Layout/useBreadcrumbs";
import useTabRoutes from "../Layout/useTabRoutes";
import { AppContext } from "../context/appContext";
import { AppRouteProps } from "../routes/routesUtil";
import WorkspaceOverview from "./WorkspaceOverview";

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
  const { currentWorkspace } = useContext(AppContext);
  useBreadcrumbs(currentWorkspace?.name, match.url);

  const { tabs, currentRouteIsTab } = useTabRoutes(tabRoutesDef);

  const tabItems = [{ name: "Overview", url: match.url }, ...tabs];

  return (
    <>
      {match.isExact || currentRouteIsTab ? (
        <>
          <PageLayout className={moduleClass} tabs={tabItems}>
            {match.isExact ? <WorkspaceOverview /> : tabRoutes}
          </PageLayout>
        </>
      ) : (
        innerRoutes
      )}
    </>
  );
};

export default WorkspacePage;
