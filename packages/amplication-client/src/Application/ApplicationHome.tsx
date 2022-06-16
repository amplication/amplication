import { CircleBadge, Snackbar } from "@amplication/design-system";
import { gql, useQuery } from "@apollo/client";
import classNames from "classnames";
import React from "react";
import { match, Route, Switch, useLocation } from "react-router-dom";
import PageContent from "../Layout/PageContent";
import RouteWithAnalytics from "../Layout/RouteWithAnalytics";
import useNavigationTabs from "../Layout/UseNavigationTabs";
import * as models from "../models";
import { formatError } from "../util/error";
import "./ApplicationHome.scss";
import { COLOR_TO_NAME } from "./constants";
import DocsTile from "./DocsTile";
import EntitiesTile from "./EntitiesTile";
import FeatureRequestTile from "./FeatureRequestTile";
import NewVersionTile from "./NewVersionTile";
import OverviewTile from "./OverviewTile";
import RolesTile from "./RolesTile";
import SyncWithGithubTile from "./SyncWithGithubTile";
import ViewCodeViewTile from "./ViewCodeViewTile";

type Props = {
  match: match<{ application: string }>;
};

const CLASS_NAME = "application-home";
const NAVIGATION_KEY = "APP_HOME";

function ApplicationHome({ match }: Props) {
  const resourceId = match.params.application;
  const location = useLocation();

  const { data, error } = useQuery<{
    resource: models.Resource;
  }>(GET_RESOURCE, {
    variables: {
      id: resourceId,
    },
  });
  useNavigationTabs(
    resourceId,
    NAVIGATION_KEY,
    location.pathname,
    data?.resource.name
  );

  const errorMessage = formatError(error);

  return (
    <PageContent className={CLASS_NAME} sideContent="">
      <Switch>
        <Route
          path="/:application/"
          render={() => (
            <>
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
              <RouteWithAnalytics
                exact
                path="/:application/"
                component={() => (
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
                )}
              />
            </>
          )}
        />
      </Switch>
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </PageContent>
  );
}

export default ApplicationHome;

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
