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

type Props = {
  match: match<{ resource: string }>;
};

const NAVIGATION_KEY = "APP_SETTINGS";

function AppSettingsPage({ match }: Props) {
  const { resource } = match.params;

  useNavigationTabs(resource, NAVIGATION_KEY, match.url, `App settings`);

  return (
    <PageContent
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
          component={ApplicationForm}
        />
        <RouteWithAnalytics
          path="/:resource/appSettings/db/update"
          component={ApplicationDatabaseSettingsForms}
        />
        <RouteWithAnalytics
          path="/:resource/appSettings/auth/update"
          component={ApplicationAuthSettingForm}
        />
      </Switch>
      {/* <Snackbar open={Boolean(error)} message={errorMessage} /> */}
    </PageContent>
  );
}

export default AppSettingsPage;
