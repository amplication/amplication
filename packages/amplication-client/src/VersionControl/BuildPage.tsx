import React, { useMemo, useState } from "react";
import { match } from "react-router-dom";
import { useQuery, useLazyQuery } from "@apollo/client";
import * as models from "../models";

import PageContent from "../Layout/PageContent";
import { Snackbar } from "@amplication/design-system";
import { formatError } from "../util/error";

import useNavigationTabs from "../Layout/UseNavigationTabs";
import BuildSteps from "./BuildSteps";
import { TruncatedId } from "../Components/TruncatedId";
import ActionLog from "./ActionLog";
import { GET_BUILD } from "./useBuildWatchStatus";
import { GET_COMMIT } from "./CommitPage";
import { truncateId } from "../util/truncatedId";
import { ClickableId } from "../Components/ClickableId";
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
const NAVIGATION_KEY = "BUILDS";

const BuildPage = ({ match }: Props) => {
  const { application, buildId } = match.params;

  const truncatedId = useMemo(() => {
    return truncateId(buildId);
  }, [buildId]);

  useNavigationTabs(
    application,
    `${NAVIGATION_KEY}_${buildId}`,
    match.url,
    `Build ${truncatedId}`
  );

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
      <PageContent className={CLASS_NAME} pageTitle={`Build ${truncatedId}`}>
        {!data ? (
          "loading..."
        ) : (
          <>
            <div className={`${CLASS_NAME}__header`}>
              <h2>
                Build <TruncatedId id={data.build.id} />
              </h2>
              {commitData && (
                <ClickableId
                  label="Commit"
                  to={`/${application}/commits/${commitData.commit.id}`}
                  id={commitData.commit.id}
                  eventData={{
                    eventName: "commitHeaderIdClick",
                  }}
                />
              )}
            </div>
            <div className={`${CLASS_NAME}__build-details`}>
              <BuildSteps build={data.build} onError={setError} />
              <aside className="log-container">
                <ActionLog
                  action={actionLog?.action}
                  title={actionLog?.title || ""}
                  versionNumber={actionLog?.versionNumber || ""}
                />
              </aside>
            </div>
          </>
        )}
      </PageContent>
      <Snackbar open={Boolean(error || errorLoading)} message={errorMessage} />
    </>
  );
};

export default BuildPage;
