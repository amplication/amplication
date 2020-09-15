import React from "react";
import { match, useRouteMatch } from "react-router-dom";

import PageContent from "../Layout/PageContent";
import FloatingToolbar from "../Layout/FloatingToolbar";

import useBreadcrumbs from "../Layout/use-breadcrumbs";
import LastBuild from "./LastBuild";
import NextBuild from "./NextBuild";
import BuildList from "./BuildList";
import BuildLog from "./BuildLog";

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

  let buildId = null;
  if (buildMatch) {
    buildId = buildMatch.params.buildId;
  }

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
            <BuildLog buildId={buildId} />
          </div>
        </div>
      </main>
    </PageContent>
  );
};

export default Builds;
