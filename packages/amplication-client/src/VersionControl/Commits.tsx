import React from "react";
import { Switch, match } from "react-router-dom";

import CommitList from "./CommitList";
import CommitsPage from "./CommitsPage";

import useNavigationTabs from "../Layout/UseNavigationTabs";
import RouteWithAnalytics from "../Layout/RouteWithAnalytics";

type Props = {
  match: match<{ resource: string }>;
};
const NAVIGATION_KEY = "ENTITIES";

function Entities({ match }: Props) {
  const { resource } = match.params;
  const pageTitle = "Commits";
  useNavigationTabs(resource, NAVIGATION_KEY, match.url, pageTitle);

  return (
    <Switch>
      <RouteWithAnalytics
        exact
        path="/:resource/commits/"
        pageTitle={pageTitle}
        component={CommitList}
      />
      <RouteWithAnalytics
        path="/:resource/commits/:commitId"
        component={CommitsPage}
      />
    </Switch>
  );
}

export default Entities;
