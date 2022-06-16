import React from "react";
import { Switch, match } from "react-router-dom";

import { CommitList } from "./CommitList";
import CommitPage from "./CommitPage";

import useNavigationTabs from "../Layout/UseNavigationTabs";
import RouteWithAnalytics from "../Layout/RouteWithAnalytics";

type Props = {
  match: match<{ resource: string }>;
};
const NAVIGATION_KEY = "ENTITIES";

function Entities({ match }: Props) {
  const { resource } = match.params;

  useNavigationTabs(resource, NAVIGATION_KEY, match.url, "Commits");

  return (
    <Switch>
      <RouteWithAnalytics
        exact
        path="/:resource/commits/"
        component={CommitList}
      />
      <RouteWithAnalytics
        path="/:resource/commits/:commitId"
        component={CommitPage}
      />
    </Switch>
  );
}

export default Entities;
