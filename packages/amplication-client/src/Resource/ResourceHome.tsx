import { gql } from "@apollo/client";
import { useContext } from "react";
import { match } from "react-router-dom";
import PageLayout from "../Layout/PageLayout";
import useBreadcrumbs from "../Layout/useBreadcrumbs";
import useTabRoutes, { TabItem } from "../Layout/useTabRoutes";
import { AppContext } from "../context/appContext";
import { AppRouteProps } from "../routes/routesUtil";
import ResourceOverview from "./ResourceOverview";
import {
  resourceMenuLayout,
  linksMap,
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
  const { currentResource, currentWorkspace, currentProject } =
    useContext(AppContext);

  const fixedTabs: TabItem[] = resourceMenuLayout[
    currentResource?.resourceType
  ]?.map((menuItem: string) => {
    return {
      name: linksMap[menuItem].title,
      url: setResourceUrlLink(
        currentWorkspace.id,
        currentProject.id,
        currentResource.id,
        linksMap[menuItem].to
      ),
    };
  });

  useBreadcrumbs(currentResource?.name, match.url);

  const { currentRouteIsTab } = useTabRoutes(tabRoutesDef);
  const tabItems = [{ name: "Overview", url: match.url }, ...(fixedTabs || [])];

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
    }
  }
`;
