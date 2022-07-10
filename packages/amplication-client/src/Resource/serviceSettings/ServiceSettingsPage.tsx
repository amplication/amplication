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

function ServiceSettingsPage({ match }: Props) {
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
              to={`/${resource}/serviceSettings/update`}
              icon="settings"
            >
              General
            </InnerTabLink>
          </div>
          <div>
            <InnerTabLink
              to={`/${resource}/serviceSettings/generationSettings/update`}
              icon="settings"
            >
              APIs & Admin UI
            </InnerTabLink>
          </div>
          <div>
            <InnerTabLink
              to={`/${resource}/serviceSettings/directories/update`}
              icon="settings"
            >
              Base Directories
            </InnerTabLink>
          </div>
          <div>
            <InnerTabLink
              to={`/${resource}/serviceSettings/db/update`}
              icon="settings"
            >
              Database
            </InnerTabLink>
          </div>
          <div>
            <InnerTabLink
              to={`/${resource}/serviceSettings/auth/update`}
              icon="settings"
            >
              Authentication
            </InnerTabLink>
          </div>
          <div>
            <InnerTabLink
              to={`/${resource}/serviceSettings/api-tokens`}
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
          path="/:resource/serviceSettings/api-tokens"
          component={ApiTokenList}
        />
        <RouteWithAnalytics
          path="/:resource/serviceSettings/update"
          component={ResourceForm}
        />
        <RouteWithAnalytics
          path="/:resource/serviceSettings/db/update"
          component={ApplicationDatabaseSettingsForms}
        />
        <RouteWithAnalytics
          path="/:resource/serviceSettings/auth/update"
          component={ApplicationAuthSettingForm}
        />
        <RouteWithAnalytics
          path="/:resource/serviceSettings/generationSettings/update"
          component={GenerationSettingsForm}
        />
        <RouteWithAnalytics
          path="/:resource/serviceSettings/directories/update"
          component={DirectoriesSettingsForm}
        />
      </Switch>
      {/* <Snackbar open={Boolean(error)} message={errorMessage} /> */}
    </PageContent>
  );
}

export default ServiceSettingsPage;
