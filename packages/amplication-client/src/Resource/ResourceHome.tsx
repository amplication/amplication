import { EnumResourceType } from "@amplication/code-gen-types/dist/models";
import { CircleBadge } from "@amplication/design-system";
import { gql } from "@apollo/client";
import React, { useContext } from "react";
import { match } from "react-router-dom";
import { AppContext } from "../context/appContext";
import PageContent from "../Layout/PageContent";
import { AppRouteProps } from "../routes/routesUtil";
import { resourceThemeMap } from "../util/resourceThemeMap";
import DocsTile from "./DocsTile";
import EntitiesTile from "./EntitiesTile";
import FeatureRequestTile from "./FeatureRequestTile";
import NewVersionTile from "./NewVersionTile";
import OverviewTile from "./OverviewTile";
import "./ResourceHome.scss";
import ResourceMenu from "./ResourceMenu";
import RolesTile from "./RolesTile";
import SyncWithGithubTile from "./SyncWithGithubTile";
import ViewCodeViewTile from "./ViewCodeViewTile";

type Props = AppRouteProps & {
  match: match<{
    workspace: string;
    project: string;
    resource: string;
  }>;
};

const CLASS_NAME = "resource-home";

const ResourceHome = ({ match, innerRoutes }: Props) => {
  const resourceId = match.params.resource;
  const { currentResource } = useContext(AppContext);

  return (
    <>
      <ResourceMenu />
      {match.isExact
        ? currentResource && (
            <PageContent
              className={CLASS_NAME}
              sideContent=""
              pageTitle={currentResource?.name}
            >
              <div
                className={`${CLASS_NAME}__header`}
                style={{
                  backgroundColor:
                    resourceThemeMap[currentResource?.resourceType].color,
                }}
              >
                {currentResource?.name}
                <CircleBadge
                  name={currentResource?.name || ""}
                  color={
                    resourceThemeMap[currentResource?.resourceType].color ||
                    "transparent"
                  }
                />
              </div>
              <div className={`${CLASS_NAME}__tiles`}>
                <NewVersionTile resourceId={resourceId} />
                {currentResource?.resourceType !==
                  EnumResourceType.ProjectConfiguration && (
                  <OverviewTile resourceId={resourceId} />
                )}
                <SyncWithGithubTile resourceId={resourceId} />
                <ViewCodeViewTile resourceId={resourceId} />
                {currentResource?.resourceType !==
                  EnumResourceType.ProjectConfiguration && (
                  <EntitiesTile resourceId={resourceId} />
                )}
                {currentResource?.resourceType !==
                  EnumResourceType.ProjectConfiguration && (
                  <RolesTile resourceId={resourceId} />
                )}
                <DocsTile />
                <FeatureRequestTile />
              </div>
            </PageContent>
          )
        : innerRoutes}
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
