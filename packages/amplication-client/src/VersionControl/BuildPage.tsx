import {
  CircularProgress,
  EnumFlexDirection,
  EnumFlexItemMargin,
  EnumGapSize,
  EnumItemsAlign,
  EnumTextStyle,
  FlexItem,
  HorizontalRule,
  Snackbar,
  Text,
  UserAndTime,
} from "@amplication/ui/design-system";
import { useLazyQuery, useQuery } from "@apollo/client";
import { useContext, useMemo } from "react";
import { match } from "react-router-dom";
import { TruncatedId } from "../Components/TruncatedId";
import PageContent, { EnumPageWidth } from "../Layout/PageContent";
import * as models from "../models";
import { formatError } from "../util/error";
import { truncateId } from "../util/truncatedId";
import ActionLog from "./ActionLog";
import BuildGitLink from "./BuildGitLink";
import "./BuildPage.scss";
import { GET_COMMIT } from "./PendingChangesPage";
import { GET_BUILD } from "./useBuildWatchStatus";
import { BackNavigation } from "../Components/BackNavigation";
import { AppContext } from "../context/appContext";

export type LogData = {
  action: models.Action;
  title: string;
  versionNumber: string;
};

type Props = {
  match: match<{ resource: string; build: string }>;
  buildId?: string;
};
const CLASS_NAME = "build-page";

const BuildPage = ({ match, buildId }: Props) => {
  const { build } = match?.params || { build: buildId };
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

  const screenBuildHeight = window.innerHeight - 360;

  const screenHeight =
    actionLog?.action.steps.length < 3
      ? screenBuildHeight - 150
      : screenBuildHeight - 305;

  const errorMessage = formatError(errorLoading);

  return (
    <>
      <PageContent
        pageWidth={EnumPageWidth.Full}
        className={CLASS_NAME}
        pageTitle={`Build ${truncatedId}`}
      >
        {!data ? (
          <CircularProgress centerToParent />
        ) : (
          <>
            {commitData && (
              <>
                <FlexItem>
                  <FlexItem
                    gap={EnumGapSize.Small}
                    direction={EnumFlexDirection.Column}
                  >
                    <Text textStyle={EnumTextStyle.H4}>
                      Build <TruncatedId id={data.build.id} />
                    </Text>

                    <Text textStyle={EnumTextStyle.Tag}>
                      <BackNavigation
                        to={`/${currentWorkspace?.id}/${currentProject?.id}/commits/${data.build.commitId}`}
                        label={
                          <>
                            Commit&nbsp;
                            <TruncatedId id={commitData.commit.id} />
                          </>
                        }
                      />
                    </Text>
                  </FlexItem>
                  <FlexItem.FlexEnd>
                    <UserAndTime
                      account={commitData.commit.user.account}
                      time={data.build.createdAt}
                    />
                  </FlexItem.FlexEnd>
                </FlexItem>

                <FlexItem
                  itemsAlign={EnumItemsAlign.Center}
                  margin={EnumFlexItemMargin.Top}
                  end={<BuildGitLink build={data.build} />}
                >
                  <Text textStyle={EnumTextStyle.Tag}>
                    {data.build.message}
                  </Text>
                </FlexItem>

                <HorizontalRule />
              </>
            )}
            <div className={`${CLASS_NAME}__build-details`}>
              <aside className="log-container">
                <ActionLog
                  height={screenHeight}
                  dynamicHeight={true}
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

export default BuildPage;
