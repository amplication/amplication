import React, { useCallback, useContext, useMemo, useState } from "react";
import { match } from "react-router-dom";
import { useQuery, useLazyQuery } from "@apollo/client";
import * as models from "../models";
import PageContent from "../Layout/PageContent";
import { CircularProgress, Snackbar } from "@amplication/ui/design-system";
import { formatError } from "../util/error";
import BuildSteps from "./BuildSteps";
import ActionLog from "./ActionLog";
import { GET_BUILD } from "./useBuildWatchStatus";
import { GET_COMMIT } from "./PendingChangesPage";
import { truncateId } from "../util/truncatedId";
import "./BuildPage.scss";
import DataPanel, { TitleDataType } from "./DataPanel";
import { BackNavigation } from "../Components/BackNavigation";
import { AppContext } from "../context/appContext";
import { boolean } from "yup/lib/locale";

type LogData = {
  action: models.Action;
  title: string;
  versionNumber: string;
};

type Props = {
  match: match<{ resource: string; build: string }>;
};
const CLASS_NAME = "build-page";

const OnBoardingBuildPage = ({ match }: Props) => {
  const { build } = match.params;
  const truncatedId = useMemo(() => {
    return truncateId(build);
  }, [build]);

  const { currentProject, currentWorkspace } = useContext(AppContext);
  const [isBuildCompleted, setIsBuildCompleted] = useState<boolean>(false);

  const handleBuildCompleted = useCallback(() => {
    setIsBuildCompleted(true);
  }, [isBuildCompleted]);

  const [getCommit, { data: commitData }] = useLazyQuery<{
    commit: models.Commit;
  }>(GET_COMMIT);

  const { data, error: errorLoading } = useQuery<{
    build: models.Build;
  }>(GET_BUILD, {
    variables: {
      buildId: build,
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

  const errorMessage = formatError(errorLoading);

  return (
    <>
      <PageContent className={CLASS_NAME} pageTitle={`Build ${truncatedId}`}>
        {!data ? (
          <CircularProgress centerToParent />
        ) : !isBuildCompleted ? (
          <>
            <BackNavigation
              to={`/${currentWorkspace?.id}/${currentProject?.id}/commits/${data.build.commitId}`}
              label="Back to Commits"
            />
            {commitData && (
              <DataPanel
                id={data.build.id}
                dataType={TitleDataType.BUILD}
                createdAt={data.build.createdAt}
                account={data.build.createdBy.account}
                relatedDataName="Commit"
                relatedDataId={commitData.commit.id}
              />
            )}
            <div className={`${CLASS_NAME}__build-details`}>
              <BuildSteps build={data.build} />
              <aside className="log-container">
                <ActionLog
                  autoHeight={true}
                  action={actionLog?.action}
                  title={actionLog?.title || ""}
                  versionNumber={actionLog?.versionNumber || ""}
                />
              </aside>
            </div>
          </>
        ) : (
          <div>building is completed</div>
        )}
      </PageContent>
      <Snackbar open={Boolean(errorLoading)} message={errorMessage} />
    </>
  );
};

export default OnBoardingBuildPage;
