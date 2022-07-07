import React from "react";
import { match, Switch } from "react-router-dom";
import InnerTabLink from "../../Layout/InnerTabLink";
import PageContent from "../../Layout/PageContent";
import RouteWithAnalytics from "../../Layout/RouteWithAnalytics";
import useNavigationTabs from "../../Layout/UseNavigationTabs";
import { ApiTokenList } from "../../Settings/ApiTokenList";
import ApplicationAuthSettingForm from "../ApplicationAuthSettingForm";
import ApplicationDatabaseSettingsForms from "../ApplicationDatabaseSettingsForms";
import ApplicationForm from "../ApplicationForm";
import GenerationSettingsForm from "./GenerationSettingsForm";
import DirectoriesSettingsForm from "./DirectoriesSettingsForm";

type Props = {
  match: match<{ application: string }>;
};

const NAVIGATION_KEY = "APP_SETTINGS";

function AppSettingsPage({ match }: Props) {
  const { application } = match.params;
  const pageTitle = "App settings";

  useNavigationTabs(application, NAVIGATION_KEY, match.url, pageTitle);

  return (
    <PageContent
      pageTitle={pageTitle}
      sideContent={
        <div>
          <div>
            <InnerTabLink
              to={`/${application}/appSettings/update`}
              icon="settings"
            >
              General
            </InnerTabLink>
          </div>
          <div>
            <InnerTabLink
              to={`/${application}/appSettings/generationSettings/update`}
              icon="settings"
            >
              APIs & Admin UI
            </InnerTabLink>
          </div>
          <div>
            <InnerTabLink
              to={`/${application}/appSettings/directories/update`}
              icon="settings"
            >
             Base Directories
            </InnerTabLink>
          </div>
          <div>
            <InnerTabLink
              to={`/${application}/appSettings/db/update`}
              icon="settings"
            >
              Database
            </InnerTabLink>
          </div>
          <div>
            <InnerTabLink
              to={`/${application}/appSettings/auth/update`}
              icon="settings"
            >
              Authentication
            </InnerTabLink>
          </div>
          <div>
            <InnerTabLink
              to={`/${application}/appSettings/api-tokens`}
              icon="id"
            >
              API Tokens
            </InnerTabLink>
          </div>
        </div>
      }
    >
      <Switch>
        <RouteWithAnalytics
          path="/:application/appSettings/api-tokens"
          component={ApiTokenList}
        />
        <RouteWithAnalytics
          path="/:application/appSettings/update"
          component={ApplicationForm}
        />
        <RouteWithAnalytics
          path="/:application/appSettings/db/update"
          component={ApplicationDatabaseSettingsForms}
        />
        <RouteWithAnalytics
          path="/:application/appSettings/auth/update"
          component={ApplicationAuthSettingForm}
        />
        <RouteWithAnalytics
          path="/:application/appSettings/generationSettings/update"
          component={GenerationSettingsForm}
        />
        <RouteWithAnalytics
          path="/:application/appSettings/directories/update"
          component={DirectoriesSettingsForm}
        />
      </Switch>
      {/* <Snackbar open={Boolean(error)} message={errorMessage} /> */}
    </PageContent>
  );
}

export default AppSettingsPage;
