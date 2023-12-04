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
import { useStiggContext } from "@stigg/react-sdk";
import { BillingFeature } from "../util/BillingFeature";

type Props = AppRouteProps & {
  match: match<{
    workspace: string;
    project: string;
    resource: string;
  }>;
};

export type FeatureTabItem = TabItem & {
  license?: BillingFeature;
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

  const { stigg } = useStiggContext();

  const tabs: FeatureTabItem[] = useMemo(() => {
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
          disabled: linksMap[menuItem].license
            ? !stigg.getBooleanEntitlement({
                featureId: linksMap[menuItem].license,
              }).hasAccess
            : false,
          iconName: linksMap[menuItem].icon,
          exact: false,
          indicatorValue,
          license: linksMap[menuItem].license,
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
