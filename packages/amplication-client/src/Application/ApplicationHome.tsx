import React from "react";
import { match } from "react-router-dom";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { Snackbar } from "@rmwc/snackbar";
import "@rmwc/snackbar/styles";
import * as models from "../models";
import { formatError } from "../util/error";
import PageContent from "../Layout/PageContent";
import FloatingToolbar from "../Layout/FloatingToolbar";
import ApplicationBadge from "./ApplicationBadge";
import { EnumPanelStyle, Panel } from "../Components/Panel";
import ApplicationForm from "./ApplicationForm";
import "./ApplicationHome.scss";
import CurrentBuildTile from "./CurrentBuildTile";
import PendingChangesTile from "./PendingChangesTile";

type Props = {
  match: match<{ application: string }>;
};

const CLASS_NAME = "application-home";

function ApplicationHome({ match }: Props) {
  const applicationId = match.params.application;

  const { data, loading, error } = useQuery<{
    app: models.App;
  }>(GET_APPLICATION, {
    variables: {
      id: applicationId,
    },
  });

  const errorMessage = formatError(error);

  if (loading) {
    return <span>Loading...</span>;
  }

  return (
    <PageContent className={CLASS_NAME} withFloatingBar>
      <main>
        <FloatingToolbar />
        <Panel
          className={`${CLASS_NAME}__info`}
          panelStyle={EnumPanelStyle.Transparent}
        >
          <div className={`${CLASS_NAME}__info__badge`}>
            <ApplicationBadge
              name={data?.app.name || ""}
              expanded
              large
              hideFullName
            />
          </div>
          <div className={`${CLASS_NAME}__info__name`}>
            {data?.app && <ApplicationForm app={data?.app} />}
          </div>
        </Panel>
        <div className={`${CLASS_NAME}__tiles`}>
          <div>
            <h2 className={`${CLASS_NAME}__tiles_title`}> Build</h2>
            <CurrentBuildTile applicationId={applicationId} />
          </div>
          <div>
            <h2 className={`${CLASS_NAME}__tiles_title`}> Commit</h2>
            <PendingChangesTile applicationId={applicationId} />
          </div>
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
    }
  }
`;
