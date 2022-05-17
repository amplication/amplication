import { useQuery } from "@apollo/client";
import React from "react";
import { match, Route, Switch } from "react-router-dom";
import { App } from "../../models";
import { FilesPanel } from "../../util/teleporter";
import { GET_APP_GIT_REPOSITORY } from "../git/SyncWithGithubPage";
import CodeViewBar from "./CodeViewBar";
import CodeViewEditor from "./CodeViewEditor";
import "./CodeViewPage.scss";

type Props = {
  match: match<{ application: string }>;
};

export type CommitListItem = {
  id: string;
  name: string;
};

function CodeViewPage({ match }: Props) {
  const applicationId = match.params.application;
  const { data } = useQuery<{ app: App }>(GET_APP_GIT_REPOSITORY, {
    variables: {
      appId: applicationId,
    },
  });
  if (!data) {
    return <div />;
  }

  return (
    <>
      <FilesPanel.Source>
        {data.app && <CodeViewBar app={data.app} />}
      </FilesPanel.Source>
      <Switch>
        <Route
          path="/:application/code-view/:appId/:buildId"
          component={CodeViewEditor}
        />
      </Switch>
    </>
  );
}

export default CodeViewPage;
