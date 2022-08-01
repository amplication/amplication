import { CircleBadge, Snackbar } from "@amplication/design-system";
import { gql, useQuery } from "@apollo/client";
import classNames from "classnames";
import React from "react";
import { match } from "react-router-dom";
import PageContent from "../Layout/PageContent";
import * as models from "../models";
import { formatError } from "../util/error";
import "./ResourceHome.scss";
import { COLOR_TO_NAME } from "./constants";
import DocsTile from "./DocsTile";
import EntitiesTile from "./EntitiesTile";
import FeatureRequestTile from "./FeatureRequestTile";
import NewVersionTile from "./NewVersionTile";
import OverviewTile from "./OverviewTile";
import RolesTile from "./RolesTile";
import SyncWithGithubTile from "./SyncWithGithubTile";
import ViewCodeViewTile from "./ViewCodeViewTile";
import { AppRouteProps } from "../routes/routesUtil";

type Props = AppRouteProps & {
  match: match<{
    workspace: string;
    project: string;
    resource: string;
  }>;
};

const CLASS_NAME = "resource-home";

const ResourceHome = ({ match, innerRoutes } : Props) => {
  const resourceId = match.params.resource;

  const { data, error } = useQuery<{
    resource: models.Resource;
  }>(GET_RESOURCE, {
    variables: {
      id: resourceId,
    },
  });

  const errorMessage = formatError(error);

  return match.isExact ? (
    <PageContent
      className={CLASS_NAME}
      sideContent=""
      pageTitle={data?.resource.name}
    >
      <div
        className={classNames(
          `${CLASS_NAME}__header`,
          `theme-${data && COLOR_TO_NAME[data.resource.color]}`
        )}
      >
        {data?.resource.name}
        <CircleBadge
          name={data?.resource.name || ""}
          color={data?.resource.color || "transparent"}
        />
      </div>
      <div className={`${CLASS_NAME}__tiles`}>
        <NewVersionTile resourceId={resourceId} />
        <OverviewTile resourceId={resourceId} />
        <SyncWithGithubTile resourceId={resourceId} />
        <ViewCodeViewTile resourceId={resourceId} />
        <EntitiesTile resourceId={resourceId} />
        <RolesTile resourceId={resourceId} />
        <DocsTile />
        <FeatureRequestTile />
      </div>
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </PageContent>
  ) : (
    innerRoutes
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
      color
      githubLastSync
      githubLastMessage
    }
  }
`;
