import React, { useMemo } from "react";
import { match, useRouteMatch } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import * as models from "../models";

import PageContent from "../Layout/PageContent";
import FloatingToolbar from "../Layout/FloatingToolbar";

import useBreadcrumbs from "../Layout/use-breadcrumbs";
import LastBuild from "./LastBuild";
import NextBuild from "./NextBuild";
import BuildList from "./BuildList";
import ActionLog from "./ActionLog";
import { GET_BUILD } from "./useBuildWatchStatus";

import "./Builds.scss";

type Props = {
  match: match<{ application: string }>;
};
const CLASS_NAME = "builds-page";

const Builds = ({ match }: Props) => {
  const { application } = match.params;
  useBreadcrumbs(match.url, "Publish");

  const buildMatch = useRouteMatch<{ buildId: string }>(
    "/:application/builds/:buildId"
  );

  let selectedBuildId = null;
  if (buildMatch) {
    selectedBuildId = buildMatch.params.buildId;
  }

  const deploymentMatch = useRouteMatch<{
    buildId: string;
    deploymentId: string;
  }>("/:application/builds/:buildId/deployments/:deploymentId");

  let selectedDeploymentId: string | null = null;
  if (deploymentMatch) {
    selectedDeploymentId = deploymentMatch.params.deploymentId;
  }

  const { data: selectedBuild } = useQuery<{
    build: models.Build;
  }>(GET_BUILD, {
    variables: {
      buildId: selectedBuildId,
    },
    skip: !selectedBuildId,
  });

  const actionLog = useMemo(() => {
    if (selectedDeploymentId) {
      const deployment = selectedBuild?.build?.deployments?.find(
        (deployment) => deployment.id === selectedDeploymentId
      );
      return deployment?.action;
    }

    return selectedBuild?.build?.action;
  }, [selectedBuild, selectedDeploymentId]);

  return (
    <PageContent className={CLASS_NAME} withFloatingBar>
      <main>
        <FloatingToolbar />
        <div className={`${CLASS_NAME}__split`}>
          <div className={`${CLASS_NAME}__split__left`}>
            <LastBuild applicationId={application} />
            <NextBuild applicationId={application} />
            <BuildList applicationId={application} />
          </div>
          <div className={`${CLASS_NAME}__split__right`}>
            <div className={`${CLASS_NAME}__split__right__sticky`}>
              <ActionLog action={actionLog} />
            </div>
          </div>
        </div>
      </main>
    </PageContent>
  );
};

export default Builds;
