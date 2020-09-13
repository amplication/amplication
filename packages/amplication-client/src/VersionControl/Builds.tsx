import React from "react";
import { match } from "react-router-dom";

import PageContent from "../Layout/PageContent";
import FloatingToolbar from "../Layout/FloatingToolbar";

import useBreadcrumbs from "../Layout/use-breadcrumbs";
import NextBuild from "./NextBuild";
import BuildList from "./BuildList";
import "./Builds.scss";

type Props = {
  match: match<{ application: string }>;
};
const CLASS_NAME = "builds-page";

const Builds = ({ match }: Props) => {
  const { application } = match.params;
  useBreadcrumbs(match.url, "Publish");

  return (
    <PageContent className={CLASS_NAME} withFloatingBar>
      <main>
        <FloatingToolbar />
        <div className={`${CLASS_NAME}__split`}>
          <div className={`${CLASS_NAME}__split__left`}>
            <NextBuild applicationId={application} />
            <BuildList applicationId={application} />
          </div>
          <div className={`${CLASS_NAME}__split__right`}>
            <div className={`${CLASS_NAME}__logs`}>Logs</div>
          </div>
        </div>
      </main>
    </PageContent>
  );
};

export default Builds;
