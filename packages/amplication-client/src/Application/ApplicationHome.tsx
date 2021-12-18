import { CircleBadge } from "@amplication/design-system";
import { gql, useQuery } from "@apollo/client";
import { Snackbar } from "@rmwc/snackbar";
import "@rmwc/snackbar/styles";
import classNames from "classnames";
import React from "react";
import { match, Route, Switch, useLocation } from "react-router-dom";
import InnerTabLink from "../Layout/InnerTabLink";
import PageContent from "../Layout/PageContent";
import RouteWithAnalytics from "../Layout/RouteWithAnalytics";
import useNavigationTabs from "../Layout/UseNavigationTabs";
import * as models from "../models";
import { ApiTokenList } from "../Settings/ApiTokenList";
import { formatError } from "../util/error";
import ApplicationAuthSettingForm from "./ApplicationAuthSettingForm";
import ApplicationDatabaseSettingsForms from "./ApplicationDatabaseSettingsForms";
import ApplicationForm from "./ApplicationForm";
import "./ApplicationHome.scss";
import { COLOR_TO_NAME } from "./constants";
import EntitiesTile from "./EntitiesTile";
import SyncWithGithubPage from "./git/SyncWithGithubPage";
import NewVersionTile from "./NewVersionTile";
import RolesTile from "./RolesTile";
import SyncWithGithubTile from "./SyncWithGithubTile";

type Props = {
  match: match<{ application: string }>;
};

const CLASS_NAME = "application-home";
const NAVIGATION_KEY = "APP_HOME";

function ApplicationHome({ match }: Props) {
  const applicationId = match.params.application;
  const location = useLocation();

  const { data, error } = useQuery<{
    app: models.App;
  }>(GET_APPLICATION, {
    variables: {
      id: applicationId,
    },
  });
  useNavigationTabs(
    applicationId,
    NAVIGATION_KEY,
    location.pathname,
    data?.app.name
  );

  const errorMessage = formatError(error);

  return (
    <PageContent
      className={CLASS_NAME}
      sideContent={
        <div>
          <div>
            <InnerTabLink to={`/${applicationId}/`} icon="home">
              Overview
            </InnerTabLink>
          </div>
          <div>
            <InnerTabLink to={`/${applicationId}/update`} icon="settings">
              App Settings
            </InnerTabLink>
          </div>
          <div>
            <InnerTabLink to={`/${applicationId}/db/update`} icon="settings">
              DB Settings
            </InnerTabLink>
          </div>
          <div>
            <InnerTabLink to={`/${applicationId}/auth/update`} icon="settings">
              Auth Settings
            </InnerTabLink>
          </div>
          <div>
            <InnerTabLink to={`/${applicationId}/github`} icon="github_outline">
              Sync with GitHub
            </InnerTabLink>
          </div>
          <div>
            <InnerTabLink to={`/${applicationId}/api-tokens`} icon="id">
              API Tokens
            </InnerTabLink>
          </div>
        </div>
      }
    >
      <Switch>
        <RouteWithAnalytics
          path="/:application/api-tokens"
          component={ApiTokenList}
        />
        <RouteWithAnalytics
          path="/:application/github"
          component={SyncWithGithubPage}
        />
        <Route
          path="/:application/"
          render={() => (
            <>
              <div
                className={classNames(
                  `${CLASS_NAME}__header`,
                  `theme-${data && COLOR_TO_NAME[data.app.color]}`
                )}
              >
                {data?.app.name}
                <CircleBadge
                  name={data?.app.name || ""}
                  color={data?.app.color || "transparent"}
                />
              </div>
              <Switch>
                <RouteWithAnalytics
                  exact
                  path="/:application/"
                  component={() => (
                    <div className={`${CLASS_NAME}__tiles`}>
                      <NewVersionTile applicationId={applicationId} />
                      <EntitiesTile applicationId={applicationId} />
                      <RolesTile applicationId={applicationId} />
                      <SyncWithGithubTile applicationId={applicationId} />
                    </div>
                  )}
                />
                <RouteWithAnalytics
                  path="/:application/update"
                  component={ApplicationForm}
                />
                <RouteWithAnalytics
                  path="/:application/db/update"
                  component={ApplicationDatabaseSettingsForms}
                />
                <RouteWithAnalytics
                  path="/:application/auth/update"
                  component={ApplicationAuthSettingForm}
                />
              </Switch>
            </>
          )}
        />
      </Switch>
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </PageContent>
  );
}

export default ApplicationHome;

export const GET_APPLICATION = gql`
  query getApplication($id: String!) {
    app(where: { id: $id }) {
      id
      createdAt
      updatedAt
      name
      description
      color
      githubTokenCreatedDate
      githubSyncEnabled
      githubRepo
      githubLastSync
      githubLastMessage
    }
  }
`;
