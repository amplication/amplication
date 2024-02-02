import {
  CircularProgress,
  EnumFlexDirection,
  EnumGapSize,
  EnumItemsAlign,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  Icon,
  Snackbar,
  Text,
} from "@amplication/ui/design-system";
import { useLazyQuery, useQuery } from "@apollo/client";
import { useContext, useMemo } from "react";
import { Link, match, useLocation } from "react-router-dom";
import { TruncatedId } from "../Components/TruncatedId";
import PageContent, { EnumPageWidth } from "../Layout/PageContent";
import * as models from "../models";
import { formatError } from "../util/error";
import { truncateId } from "../util/truncatedId";
import ActionLog from "./ActionLog";
import "./BuildPage.scss";
import { GET_COMMIT } from "./PendingChangesPage";
import useBuildWatchStatus, { GET_BUILD } from "./useBuildWatchStatus";
import { BackNavigation } from "../Components/BackNavigation";
import { AppContext } from "../context/appContext";
import { resourceThemeMap } from "../Resource/constants";
import useBreadcrumbs from "../Layout/useBreadcrumbs";

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

  const { currentProject, currentWorkspace, resources } =
    useContext(AppContext);

  const location = useLocation();

  const [getCommit, { data: commitData }] = useLazyQuery<{
    commit: models.Commit;
  }>(GET_COMMIT);

  const { data: buildData, error: errorLoading } = useQuery<{
    build: models.Build;
  }>(GET_BUILD, {
    variables: {
      buildId: build,
    },
    onCompleted: (data) => {
      getCommit({ variables: { commitId: data.build.commitId } });
    },
  });

  const { data: updatedBuild } = useBuildWatchStatus(buildData?.build);

  useBreadcrumbs(buildData?.build?.version, location.pathname);

  const currentResource = useMemo(
    () =>
      resources.find(
        (resource) => resource.id === updatedBuild.build?.resourceId
      ),
    [resources, updatedBuild]
  );

  const actionLog = useMemo<LogData | null>(() => {
    if (!updatedBuild?.build) return null;

    if (!updatedBuild.build.action) return null;

    return {
      action: updatedBuild.build.action,
      title: "Build log",
      versionNumber: updatedBuild.build.version,
    };
  }, [updatedBuild]);

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
        {!updatedBuild ? (
          <CircularProgress centerToParent />
        ) : (
          <>
            {commitData && (
              <FlexItem
                direction={EnumFlexDirection.Column}
                className={`${CLASS_NAME}__header`}
              >
                <Text textStyle={EnumTextStyle.Tag}>
                  <BackNavigation
                    to={`/${currentWorkspace?.id}/${currentProject?.id}/commits/${updatedBuild.build.commitId}`}
                    label={
                      <>
                        &nbsp;Return to Commit&nbsp;
                        <TruncatedId id={commitData.commit.id} />
                      </>
                    }
                    iconSize="xsmall"
                  />
                </Text>

                <FlexItem
                  direction={EnumFlexDirection.Column}
                  gap={EnumGapSize.None}
                >
                  <Link
                    to={`/${currentWorkspace?.id}/${currentProject?.id}/${currentResource?.id}`}
                  >
                    <FlexItem
                      itemsAlign={EnumItemsAlign.Center}
                      gap={EnumGapSize.Small}
                      className={`${CLASS_NAME}__header__title__service`}
                    >
                      <Icon
                        icon={
                          resourceThemeMap[currentResource?.resourceType]?.icon
                        }
                        size="large"
                        color={EnumTextColor.ThemeTurquoise}
                      />
                      <Text textColor={EnumTextColor.ThemeTurquoise}>
                        {currentResource?.name}
                      </Text>
                    </FlexItem>
                  </Link>
                  <h3>
                    Commit&nbsp;
                    <span>
                      <TruncatedId id={commitData.commit.id} />
                    </span>
                  </h3>
                </FlexItem>
              </FlexItem>
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
