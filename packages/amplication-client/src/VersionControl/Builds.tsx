import React from "react";
import { match } from "react-router-dom";
import { LazyLog } from "react-lazylog";

import PageContent from "../Layout/PageContent";
import FloatingToolbar from "../Layout/FloatingToolbar";

import useBreadcrumbs from "../Layout/use-breadcrumbs";
import LastBuild from "./LastBuild";
import NextBuild from "./NextBuild";
import BuildList from "./BuildList";
import logsImage from "../assets/images/logs.svg";

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
            <LastBuild applicationId={application} />
            <NextBuild applicationId={application} />
            <BuildList applicationId={application} />
          </div>
          <div className={`${CLASS_NAME}__split__right`}>
            <div className={`${CLASS_NAME}__logs`}>
              <div className={`${CLASS_NAME}__logs__header`}>
                <h2>Build Log</h2>
              </div>
              <LazyLog
                lineClassName="log_line"
                extraLines={1}
                enableSearch={false}
                text={"TO-DO: Show the logs text from the server here..."}
              />
              <div className={`${CLASS_NAME}__logs__empty-state`}>
                <img src={logsImage} alt="log is empty" />
                <div className={`${CLASS_NAME}__logs__empty-state__title`}>
                  Create or select a build to view the log
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </PageContent>
  );
};

export default Builds;
