import { CircularProgress, Snackbar } from "@amplication/ui/design-system";
import { useLazyQuery, useQuery } from "@apollo/client";
import { useContext, useMemo } from "react";
import { match } from "react-router-dom";
import { BackNavigation } from "../Components/BackNavigation";
import PageContent from "../Layout/PageContent";
import { AppContext } from "../context/appContext";
import * as models from "../models";
import { formatError } from "../util/error";
import { truncateId } from "../util/truncatedId";
import ActionLog from "./ActionLog";
import "./BuildPage.scss";
import BuildSteps from "./BuildSteps";
import DataPanel, { TitleDataType } from "./DataPanel";
import { GET_COMMIT } from "./PendingChangesPage";
import { GET_BUILD } from "./useBuildWatchStatus";

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
        ) : (
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
        )}
      </PageContent>
      <Snackbar open={Boolean(errorLoading)} message={errorMessage} />
    </>
  );
};

export default OnBoardingBuildPage;
