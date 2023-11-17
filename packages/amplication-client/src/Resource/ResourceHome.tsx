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
const OVERVIEW = "Overview";

const ResourceHome = ({
  match,
  innerRoutes,
  tabRoutes,
  tabRoutesDef,
}: Props) => {
  const { currentResource, currentWorkspace, currentProject, pendingChanges } =
    useContext(AppContext);

  const tabs: TabItem[] = useMemo(() => {
    const fixedRoutes = resourceMenuLayout[currentResource?.resourceType]?.map(
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
    );
    return [
      {
        name: OVERVIEW,
        to: match.url,
        exact: true,
      },
      ...(fixedRoutes || []),
    ];
  }, [currentResource, currentWorkspace, currentProject, pendingChanges]);

  useBreadcrumbs(currentResource?.name, match.url);

  const { currentRouteIsTab } = useTabRoutes(tabRoutesDef);

  return (
    <>
      {(match.isExact || currentRouteIsTab) && currentResource ? (
        <PageLayout className={CLASS_NAME} tabs={tabs}>
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
