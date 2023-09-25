import { TabItem } from "@amplication/ui/design-system";
import { gql } from "@apollo/client";
import { useContext, useMemo } from "react";
import { match } from "react-router-dom";
import PageLayout from "../Layout/PageLayout";
import useBreadcrumbs from "../Layout/useBreadcrumbs";
import useTabRoutes from "../Layout/useTabRoutes";
import { AppContext } from "../context/appContext";
import { AppRouteProps } from "../routes/routesUtil";
import ResourceOverview from "./ResourceOverview";
import {
  MenuItemLinks,
  linksMap,
  resourceMenuLayout,
  setResourceUrlLink,
} from "./resourceMenuUtils";

type Props = AppRouteProps & {
  match: match<{
    workspace: string;
    project: string;
    resource: string;
  }>;
};

const CLASS_NAME = "resource-home";

const ResourceHome = ({
  match,
  innerRoutes,
  tabRoutes,
  tabRoutesDef,
}: Props) => {
  const { currentResource, currentWorkspace, currentProject, pendingChanges } =
    useContext(AppContext);

  const fixedTabs: TabItem[] = useMemo(
    () =>
      resourceMenuLayout[currentResource?.resourceType]?.map(
        (menuItem: MenuItemLinks) => {
          const indicatorValue =
            menuItem === "pendingChanges" && pendingChanges?.length
              ? pendingChanges.length
              : undefined;

          return {
            name: linksMap[menuItem].title,
            to: setResourceUrlLink(
              currentWorkspace.id,
              currentProject.id,
              currentResource.id,
              linksMap[menuItem].to
            ),
            iconName: linksMap[menuItem].icon,
            exact: false,
            indicatorValue,
          };
        }
      ),
    [currentResource, currentWorkspace, currentProject, pendingChanges]
  );

  useBreadcrumbs(currentResource?.name, match.url);

  const { currentRouteIsTab } = useTabRoutes(tabRoutesDef);
  const tabItems: TabItem[] = [
    {
      name: "Overview",
      to: match.url,
      exact: true,
    },
    ...(fixedTabs || []),
  ];

  return (
    <>
      {(match.isExact || currentRouteIsTab) && currentResource ? (
        <PageLayout className={CLASS_NAME} tabs={tabItems}>
          {match.isExact ? <ResourceOverview /> : tabRoutes}
        </PageLayout>
      ) : (
        innerRoutes
      )}
    </>
  );
};

export default ResourceHome;

export const GET_RESOURCE = gql`
  query getResource($id: String!) {
    resource(where: { id: $id }) {
      id
      createdAt
      updatedAt
      name
      description
      githubLastSync
      githubLastMessage
      resourceType
    }
  }
`;
