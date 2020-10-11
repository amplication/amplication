import React from "react";
import { match } from "react-router-dom";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { Snackbar } from "@rmwc/snackbar";
import "@rmwc/snackbar/styles";
import classNames from "classnames";
import * as models from "../models";
import { formatError } from "../util/error";
import PageContent from "../Layout/PageContent";
import ApplicationBadge from "./ApplicationBadge";
import { EnumPanelStyle, Panel } from "../Components/Panel";
import ApplicationForm from "./ApplicationForm";
import "./ApplicationHome.scss";
import CurrentBuildTile from "./CurrentBuildTile";
import PendingChangesTile from "./PendingChangesTile";
import EntitiesTile from "./EntitiesTile";
import RolesTile from "./RolesTile";
import { COLOR_TO_IMAGE } from "./constants";

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
    <PageContent className={CLASS_NAME}>
      <Panel
        //
        className={classNames(`${CLASS_NAME}__info`)}
        style={
          data && {
            backgroundImage: `url(
            ${COLOR_TO_IMAGE[data.app.color]})`,
          }
        }
        panelStyle={EnumPanelStyle.Bordered}
      >
        <div className={`${CLASS_NAME}__info__badge`}>
          <ApplicationBadge
            name={data?.app.name || ""}
            expanded
            color={data?.app.color}
            large
            hideFullName
          />
        </div>
        <div className={`${CLASS_NAME}__info__name`}>
          {data?.app && <ApplicationForm app={data?.app} />}
        </div>
      </Panel>
      <main>
        <div className={`${CLASS_NAME}__tiles`}>
          <EntitiesTile applicationId={applicationId} />
          <RolesTile applicationId={applicationId} />
          <PendingChangesTile applicationId={applicationId} />
          <CurrentBuildTile applicationId={applicationId} />
        </div>
      </main>
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
    }
  }
`;
