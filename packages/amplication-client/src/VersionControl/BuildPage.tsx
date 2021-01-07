import React, { useMemo, useState } from "react";
import { match } from "react-router-dom";
import { useQuery, useLazyQuery } from "@apollo/client";
import * as models from "../models";

import PageContent from "../Layout/PageContent";
import FloatingToolbar from "../Layout/FloatingToolbar";
import { Snackbar } from "@rmwc/snackbar";
import { formatError } from "../util/error";

import useBreadcrumbs from "../Layout/use-breadcrumbs";
import BuildSteps from "./BuildSteps";
import { TruncatedId } from "../Components/TruncatedId";
import ActionLog from "./ActionLog";
import { GET_BUILD } from "./useBuildWatchStatus";
import { GET_COMMIT } from "./CommitPage";
import CommitHeader from "./CommitHeader";
import "./BuildPage.scss";

type LogData = {
  action: models.Action;
  title: string;
  versionNumber: string;
};

type Props = {
  match: match<{ application: string; buildId: string }>;
};
const CLASS_NAME = "build-page";

const BuildPage = ({ match }: Props) => {
  const { buildId } = match.params;
  useBreadcrumbs(match.url, "Build");

  const [error, setError] = useState<Error>();

  const [getCommit, { data: commitData }] = useLazyQuery<{
    commit: models.Commit;
  }>(GET_COMMIT);

  const { data, error: errorLoading } = useQuery<{
    build: models.Build;
  }>(GET_BUILD, {
    variables: {
      buildId: buildId,
    },
    onCompleted: (data) => {
      getCommit({ variables: { commitId: data.build.commitId } });
    },
  });

  const actionLog = useMemo<LogData | null>(() => {
    if (!data?.build) return null;

    if (!data.build.action) return null;

    return {
      action: data.build.action,
      title: "Build log",
      versionNumber: data.build.version,
    };
  }, [data]);

  const errorMessage =
    formatError(errorLoading) || (error && formatError(error));

  return (
    <>
      <PageContent className={CLASS_NAME} withFloatingBar>
        <main>
          <FloatingToolbar />
          {!data ? (
            "loading..."
          ) : (
            <>
              <h1>
                Build <TruncatedId id={data.build.id} />
              </h1>
              {commitData && (
                <div className={`${CLASS_NAME}__commit-header`}>
                  <CommitHeader
                    clickableId
                    commit={commitData.commit}
                    applicationId={data.build.appId}
                  />
                </div>
              )}
              <h2>Details</h2>
              <BuildSteps build={data.build} onError={setError} />
            </>
          )}
        </main>
        <aside className="log-container">
          <ActionLog
            action={actionLog?.action}
            title={actionLog?.title || ""}
            versionNumber={actionLog?.versionNumber || ""}
          />
        </aside>
      </PageContent>
      <Snackbar open={Boolean(error || errorLoading)} message={errorMessage} />
    </>
  );
};

export default BuildPage;
