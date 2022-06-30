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

type Props = {
  match: match<{ resource: string }>;
};

const NAVIGATION_KEY = "APP_SETTINGS";

function ServiceSettingsPage({ match }: Props) {
  const { resource } = match.params;

  useNavigationTabs(resource, NAVIGATION_KEY, match.url, `Resource settings`);

  return (
    <PageContent
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
      </Switch>
      {/* <Snackbar open={Boolean(error)} message={errorMessage} /> */}
    </PageContent>
  );
}

export default ServiceSettingsPage;
