import React from "react";
import { match, Switch } from "react-router-dom";
import InnerTabLink from "../../Layout/InnerTabLink";
import PageContent from "../../Layout/PageContent";
import RouteWithAnalytics from "../../Layout/RouteWithAnalytics";
import useNavigationTabs from "../../Layout/UseNavigationTabs";
import { ApiTokenList } from "../../Settings/ApiTokenList";
import ApplicationAuthSettingForm from "../ApplicationAuthSettingForm";
import ApplicationDatabaseSettingsForms from "../ApplicationDatabaseSettingsForms";
import ResourceForm from "../ResourceForm";
import GenerationSettingsForm from "./GenerationSettingsForm";
import DirectoriesSettingsForm from "./DirectoriesSettingsForm";

type Props = {
  match: match<{ resource: string }>;
};

const NAVIGATION_KEY = "APP_SETTINGS";

function AppSettingsPage({ match }: Props) {
  const { resource } = match.params;
  const pageTitle = "App settings";

  useNavigationTabs(resource, NAVIGATION_KEY, match.url, pageTitle);

  return (
    <PageContent
      pageTitle={pageTitle}
      sideContent={
        <div>
          <div>
            <InnerTabLink
              to={`/${resource}/appSettings/update`}
              icon="settings"
            >
              General
            </InnerTabLink>
          </div>
          <div>
            <InnerTabLink
              to={`/${resource}/appSettings/generationSettings/update`}
              icon="settings"
            >
              APIs & Admin UI
            </InnerTabLink>
          </div>
          <div>
            <InnerTabLink
              to={`/${resource}/appSettings/directories/update`}
              icon="settings"
            >
              Base Directories
            </InnerTabLink>
          </div>
          <div>
            <InnerTabLink
              to={`/${resource}/appSettings/db/update`}
              icon="settings"
            >
              Database
            </InnerTabLink>
          </div>
          <div>
            <InnerTabLink
              to={`/${resource}/appSettings/auth/update`}
              icon="settings"
            >
              Authentication
            </InnerTabLink>
          </div>
          <div>
            <InnerTabLink to={`/${resource}/appSettings/api-tokens`} icon="id">
              API Tokens
            </InnerTabLink>
          </div>
        </div>
      }
    >
      <Switch>
        <RouteWithAnalytics
          path="/:resource/appSettings/api-tokens"
          component={ApiTokenList}
        />
        <RouteWithAnalytics
          path="/:resource/appSettings/update"
          component={ResourceForm}
        />
        <RouteWithAnalytics
          path="/:resource/appSettings/db/update"
          component={ApplicationDatabaseSettingsForms}
        />
        <RouteWithAnalytics
          path="/:resource/appSettings/auth/update"
          component={ApplicationAuthSettingForm}
        />
        <RouteWithAnalytics
          path="/:resource/appSettings/generationSettings/update"
          component={GenerationSettingsForm}
        />
        <RouteWithAnalytics
          path="/:resource/appSettings/directories/update"
          component={DirectoriesSettingsForm}
        />
      </Switch>
      {/* <Snackbar open={Boolean(error)} message={errorMessage} /> */}
    </PageContent>
  );
}

export default AppSettingsPage;
