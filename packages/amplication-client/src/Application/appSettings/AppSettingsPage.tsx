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
  match: match<{ application: string }>;
};

//const CLASS_NAME = "application-home";
const NAVIGATION_KEY = "APP_SETTINGS";

function AppSettingsPage({ match }: Props) {
  const { application } = match.params;

  useNavigationTabs(application, NAVIGATION_KEY, match.url, `App settings`);

  return (
    <PageContent
      className={"CLASS_NAME"}
      sideContent={
        <div>
          <div>
            <InnerTabLink
              to={`/${application}/appSettings/update`}
              icon="settings"
            >
              App Settings
            </InnerTabLink>
          </div>
          <div>
            <InnerTabLink
              to={`/${application}/appSettings/db/update`}
              icon="settings"
            >
              DB Settings
            </InnerTabLink>
          </div>
          <div>
            <InnerTabLink
              to={`/${application}/appSettings/auth/update`}
              icon="settings"
            >
              Auth Settings
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
      </Switch>
      {/* <Snackbar open={Boolean(error)} message={errorMessage} /> */}
    </PageContent>
  );
}

export default AppSettingsPage;
