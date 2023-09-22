import { EnumResourceType } from "@amplication/code-gen-types/models";
import { CircleBadge } from "@amplication/ui/design-system";
import { gql } from "@apollo/client";
import { useContext } from "react";
import { match } from "react-router-dom";
import PageLayout from "../Layout/PageLayout";
import { AppContext } from "../context/appContext";
import { AppRouteProps } from "../routes/routesUtil";
import DocsTile from "./DocsTile";
import EntitiesTile from "./EntitiesTile";
import FeatureRequestTile from "./FeatureRequestTile";
import OverviewTile from "./OverviewTile";
import "./ResourceHome.scss";
import ResourceMenu from "./ResourceMenu";
import ResourceNameField from "./ResourceNameField";
import RolesTile from "./RolesTile";
import { ServicesTile } from "./ServicesTile";
import SyncWithGithubTile from "./SyncWithGithubTile";
import { TopicsTile } from "./TopicsTile";
import ViewCodeViewTile from "./ViewCodeViewTile";
import { resourceThemeMap } from "./constants";
import useBreadcrumbs from "../Layout/useBreadcrumbs";
import useTabRoutes from "../Layout/useTabRoutes";
import PageContent from "../Layout/PageContent";

type Props = AppRouteProps & {
  match: match<{
    workspace: string;
    project: string;
    resource: string;
  }>;
};

const CLASS_NAME = "resource-home";
const PAGE_TITLE = "Resource Overview";

const ResourceHome = ({
  match,
  innerRoutes,
  tabRoutes,
  tabRoutesDef,
}: Props) => {
  const resourceId = match.params.resource;
  const { currentResource } = useContext(AppContext);

  useBreadcrumbs(currentResource?.name, match.url);

  const { tabs, currentRouteIsTab } = useTabRoutes(tabRoutesDef);
  const tabItems = [{ name: "Overview", url: match.url }, ...tabs];

  return (
    <>
      {(match.isExact || currentRouteIsTab) && currentResource ? (
        <PageLayout className={CLASS_NAME} tabs={tabItems}>
          {match.isExact ? (
            <PageContent pageTitle={PAGE_TITLE}>
              <div
                className={`${CLASS_NAME}__header`}
                style={{
                  backgroundColor:
                    resourceThemeMap[currentResource?.resourceType].color,
                }}
              >
                <CircleBadge
                  name={currentResource?.name || ""}
                  color={
                    resourceThemeMap[currentResource?.resourceType].color ||
                    "transparent"
                  }
                />
                <ResourceNameField
                  currentResource={currentResource}
                  resourceId={resourceId}
                />
              </div>
              <div className={`${CLASS_NAME}__tiles`}>
                {currentResource?.resourceType === EnumResourceType.Service && (
                  <OverviewTile resourceId={resourceId} />
                )}
                <SyncWithGithubTile resourceId={resourceId} />
                <ViewCodeViewTile resourceId={resourceId} />
                {currentResource?.resourceType === EnumResourceType.Service && (
                  <EntitiesTile resourceId={resourceId} />
                )}
                {currentResource?.resourceType === EnumResourceType.Service && (
                  <RolesTile resourceId={resourceId} />
                )}
                {currentResource?.resourceType ===
                  EnumResourceType.MessageBroker && (
                  <TopicsTile resourceId={resourceId} />
                )}
                {currentResource?.resourceType ===
                  EnumResourceType.MessageBroker && (
                  <ServicesTile resourceId={resourceId} />
                )}
                <DocsTile />
                <FeatureRequestTile />
              </div>
            </PageContent>
          ) : (
            tabRoutes
          )}
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
