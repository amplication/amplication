import { useQuery } from "@apollo/client";
import React from "react";
import { match, Route, Switch, useLocation } from "react-router-dom";
import useNavigationTabs from "../../Layout/UseNavigationTabs";
import { FilesPanel } from "../../util/teleporter";
import {
  AppWithGitRepository,
  GET_APP_GIT_REPOSITORY,
} from "../git/SyncWithGithubPage";
import CodeViewBar from "./CodeViewBar";
import "./CodeViewPage.scss";

type Props = {
  match: match<{ application: string }>;
};

export type CommitListItem = {
  id: string;
  name: string;
};
const NAVIGATION_KEY = "CODE_VIEW";

function CodeViewPage({ match }: Props) {
  const applicationId = match.params.application;
  const { data } = useQuery<{ app: AppWithGitRepository }>(
    GET_APP_GIT_REPOSITORY,
    {
      variables: {
        appId: applicationId,
      },
    }
  );

  const location = useLocation();

  useNavigationTabs(
    applicationId,
    NAVIGATION_KEY,
    location.pathname,
    "CodeView"
  );

  return (
    <div>
      <FilesPanel.Source>
        {data?.app && <CodeViewBar app={data.app} />}
      </FilesPanel.Source>
      <Switch>
        <Route path="/:appId/:buildId/:fileName" component={CodeViewPage} />
      </Switch>
    </div>
  );
}

export default CodeViewPage;
