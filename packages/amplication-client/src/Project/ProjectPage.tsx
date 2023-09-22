import React, { useContext } from "react";
import ResourceList from "../Workspaces/ResourceList";
import { AppRouteProps } from "../routes/routesUtil";
import { match } from "react-router-dom";
import "./ProjectPage.scss";
import useBreadcrumbs from "../Layout/useBreadcrumbs";
import PageLayout from "../Layout/PageLayout";
import { AppContext } from "../context/appContext";
import useTabRoutes from "../Layout/useTabRoutes";

type Props = AppRouteProps & {
  match: match<{
    workspace: string;
    project: string;
  }>;
};

const ProjectPage: React.FC<Props> = ({
  innerRoutes,
  match,
  moduleClass,
  tabRoutes,
  tabRoutesDef,
}) => {
  const { currentProject } = useContext(AppContext);

  useBreadcrumbs(currentProject?.name, match.url);
  const { tabs, currentRouteIsTab } = useTabRoutes(tabRoutesDef);

  const tabItems = [{ name: "Overview", url: match.url }, ...tabs];

  return match.isExact || currentRouteIsTab ? (
    <>
      <PageLayout className={moduleClass} tabs={tabItems}>
        {match.isExact ? <ResourceList /> : tabRoutes}
      </PageLayout>
    </>
  ) : (
    innerRoutes
  );
};

export default ProjectPage;
