import React from "react";
import { Switch, Route, match, NavLink } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { Snackbar } from "@rmwc/snackbar";
import "@rmwc/snackbar/styles";
import classNames from "classnames";
import * as models from "../models";
import { formatError } from "../util/error";
import PageContent from "../Layout/PageContent";
import { CircleBadge } from "@amplication/design-system";
import ApplicationForm from "./ApplicationForm";
import "./ApplicationHome.scss";
import LastCommitTile from "./LastCommitTile";
import SyncWithGithubTile from "./SyncWithGithubTile";
import EntitiesTile from "./EntitiesTile";
import RolesTile from "./RolesTile";
import { COLOR_TO_NAME } from "./constants";

type Props = {
  match: match<{ application: string }>;
};

const CLASS_NAME = "application-home";

function ApplicationHome({ match }: Props) {
  const applicationId = match.params.application;

  const { data, error } = useQuery<{
    app: models.App;
  }>(GET_APPLICATION, {
    variables: {
      id: applicationId,
    },
  });

  const errorMessage = formatError(error);

  return (
    <PageContent
      className={CLASS_NAME}
      sideContent={
        <>
          <div>
            <NavLink to={`/${applicationId}/`}>Home</NavLink>
          </div>
          <div>
            <NavLink to={`/${applicationId}/update`}>Settings</NavLink>
          </div>
        </>
      }
    >
      <div
        className={classNames(
          `${CLASS_NAME}__header`,
          `theme-${data && COLOR_TO_NAME[data.app.color]}`
        )}
      >
        <CircleBadge
          name={data?.app.name || ""}
          color={data?.app.color || "transparent"}
        />
      </div>

      <Switch>
        <Route
          exact
          path="/:application/"
          component={() => (
            <div className={`${CLASS_NAME}__tiles`}>
              <EntitiesTile applicationId={applicationId} />
              <RolesTile applicationId={applicationId} />
              <SyncWithGithubTile applicationId={applicationId} />
              <LastCommitTile applicationId={applicationId} />
            </div>
          )}
        />
        <Route path="/:application/update" component={ApplicationForm} />
      </Switch>
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </PageContent>
  );
}

export default ApplicationHome;

export const GET_APPLICATION = gql`
  query getApplication($id: String!) {
    app(where: { id: $id }) {
      id
      createdAt
      updatedAt
      name
      description
      color
      githubTokenCreatedDate
      githubSyncEnabled
      githubRepo
      githubLastSync
      githubLastMessage
    }
  }
`;
