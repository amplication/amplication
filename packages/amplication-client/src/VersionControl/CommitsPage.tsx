import React from "react";
import { match } from "react-router-dom";
import PageContent from "../Layout/PageContent";
import { AppRouteProps } from "../routes/routesUtil";
import CommitList from "./CommitList";

type Props = AppRouteProps & {
  match: match<{
    workspace: string;
    project: string;
    resource: string;
    commit: string;
  }>;
};

const CommitsPage: React.FC<Props> = ({ innerRoutes, match, moduleClass }) => {
  const commitId = match.params.commit

  return (
    <PageContent
      className={moduleClass}
      pageTitle={`Commit ${commitId}`}
      sideContent={<CommitList commitId={commitId} />}
    >
      {innerRoutes}
    </PageContent>
  );
};

export default CommitsPage;
