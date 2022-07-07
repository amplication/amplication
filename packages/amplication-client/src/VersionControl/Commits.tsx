import React from "react";
import { Switch, match } from "react-router-dom";

import { CommitList } from "./CommitList";
import CommitPage from "./CommitPage";

import useNavigationTabs from "../Layout/UseNavigationTabs";
import RouteWithAnalytics from "../Layout/RouteWithAnalytics";

type Props = {
  match: match<{ application: string }>;
};
const NAVIGATION_KEY = "ENTITIES";

function Entities({ match }: Props) {
  const { application } = match.params;
  const pageTitle = "Commits";
  useNavigationTabs(application, NAVIGATION_KEY, match.url, pageTitle);

  return (
    <Switch>
      <RouteWithAnalytics
        exact
        path="/:application/commits/"
        pageTitle={pageTitle}
        component={CommitList}
      />
      <RouteWithAnalytics
        path="/:application/commits/:commitId"
        component={CommitPage}
      />
    </Switch>
  );
}

export default Entities;
