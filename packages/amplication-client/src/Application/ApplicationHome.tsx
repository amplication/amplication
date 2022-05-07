import {
  Button,
  CircleBadge,
  EnumButtonStyle,
  Snackbar,
} from "@amplication/design-system";
import { gql, useQuery } from "@apollo/client";
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
import DocsTile from "./DocsTile";
import EntitiesTile from "./EntitiesTile";
import GithubTileFooter from "./GithubTileFooter";
// import EntitiesTile from "./EntitiesTile";
import NewVersionTile from "./NewVersionTile";
import OverviewSecondaryTile from "./OverviewSecondaryTile";
import OverviewTile from "./OverviewTile";
import RolesTile from "./RolesTile";
// import RolesTile from "./RolesTile";
// import SyncWithGithubTile from "./SyncWithGithubTile";

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
                      <OverviewTile />
                      <OverviewSecondaryTile
                        icon="github"
                        title="Sync with GitHub"
                        message="Push the Amplication-generated app to your GitHub repo. Track changes, track our code. You are in full control of your app."
                        footer={<GithubTileFooter />}
                      />
                      <EntitiesTile applicationId={applicationId} />
                      <RolesTile applicationId={applicationId} />
                      <DocsTile />
                      <OverviewSecondaryTile
                        icon="main_logo"
                        title="Submit a feature request"
                        message="If there’s something you’d like to see in Amplication, open a Feature Request on GitHub and tell us about it."
                        footer={
                          <Button
                            buttonStyle={EnumButtonStyle.Outline}
                            type="button"
                          >
                            Share your idea
                          </Button>
                        }
                      />
                      <OverviewSecondaryTile
                        icon="code"
                        title="Code View"
                        message="We continuously add new features to Amplication. Soon you’ll be able to access the generated code within the Amplication Console."
                        footer={
                          <Button
                            buttonStyle={EnumButtonStyle.Outline}
                            type="button"
                          >
                            View roadmap
                          </Button>
                        }
                        showComingSoon
                      />
                      {/*
                      <SyncWithGithubTile applicationId={applicationId} /> */}
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
      githubLastSync
      githubLastMessage
    }
  }
`;
