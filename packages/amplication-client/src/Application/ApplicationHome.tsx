import React from "react";
import { match } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { Snackbar } from "@rmwc/snackbar";
import "@rmwc/snackbar/styles";
import classNames from "classnames";
import * as models from "../models";
import { formatError } from "../util/error";
import PageContent from "../Layout/PageContent";
import { EnumPanelStyle, Panel, CircleBadge } from "@amplication/design-system";
import ApplicationForm from "./ApplicationForm";
import "./ApplicationHome.scss";
import CurrentBuildTile from "./CurrentBuildTile";
import PendingChangesTile from "./PendingChangesTile";
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
    <PageContent>
      <div className={CLASS_NAME}>
        <Panel
          //
          className={classNames(
            `${CLASS_NAME}__header`,
            `theme-${data && COLOR_TO_NAME[data.app.color]}`
          )}
          panelStyle={EnumPanelStyle.Bordered}
        >
          <CircleBadge
            name={data?.app.name || ""}
            color={data?.app.color || "transparent"}
          />
        </Panel>

        <main className={`${CLASS_NAME}__main`}>
          <div className={`${CLASS_NAME}__main__form`}>
            <h1>{data?.app.name}</h1>
            {data?.app && <ApplicationForm app={data?.app} />}
          </div>
          <div className={`${CLASS_NAME}__main__tiles`}>
            <div>
              <EntitiesTile applicationId={applicationId} />
            </div>
            <div>
              <RolesTile applicationId={applicationId} />
            </div>
            <div>
              <PendingChangesTile applicationId={applicationId} />
            </div>
            <div>
              <CurrentBuildTile applicationId={applicationId} />
            </div>
          </div>
        </main>
        <Snackbar open={Boolean(error)} message={errorMessage} />
      </div>
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
    }
  }
`;
