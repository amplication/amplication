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
import { useQuery } from "@apollo/client";
import { useContext, useMemo } from "react";
import { Link, match } from "react-router-dom";
import { BackNavigation } from "../Components/BackNavigation";
import { TruncatedId } from "../Components/TruncatedId";
import PageContent, { EnumPageWidth } from "../Layout/PageContent";
import { resourceThemeMap } from "../Resource/constants";
import { AppContext } from "../context/appContext";
import * as models from "../models";
import { formatError } from "../util/error";
import { truncateId } from "../util/truncatedId";
import { useProjectBaseUrl } from "../util/useProjectBaseUrl";
import { useResourceBaseUrl } from "../util/useResourceBaseUrl";
import ActionLog from "./ActionLog";
import BuildGitLink from "./BuildGitLink";
import "./BuildPage.scss";
import useBuildWatchStatus, { GET_BUILD } from "./useBuildWatchStatus";

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

  const { resources } = useContext(AppContext);

  const { baseUrl } = useProjectBaseUrl();

  const { data: buildData, error: errorLoading } = useQuery<{
    build: models.Build;
  }>(GET_BUILD, {
    variables: {
      buildId: build,
    },
  });

  const { data: updatedBuild } = useBuildWatchStatus(buildData?.build);

  const currentResource = useMemo(
    () =>
      resources.find(
        (resource) => resource.id === updatedBuild.build?.resourceId
      ),
    [resources, updatedBuild]
  );

  const { baseUrl: resourceBaseUrl } = useResourceBaseUrl({
    overrideResourceId: updatedBuild.build?.resourceId,
  });

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
            {buildData && (
              <FlexItem
                direction={EnumFlexDirection.Column}
                className={`${CLASS_NAME}__header`}
              >
                <Text textStyle={EnumTextStyle.Tag}>
                  <BackNavigation
                    to={`${baseUrl}/commits/${updatedBuild.build.commitId}`}
                    label={
                      <>
                        &nbsp;Return to Commit&nbsp;
                        <TruncatedId id={buildData.build.commitId} />
                      </>
                    }
                    iconSize="xsmall"
                  />
                </Text>

                <FlexItem
                  direction={EnumFlexDirection.Row}
                  itemsAlign={EnumItemsAlign.End}
                  gap={EnumGapSize.None}
                  end={
                    <BuildGitLink
                      build={updatedBuild.build}
                      textColor={EnumTextColor.ThemeTurquoise}
                    />
                  }
                  start={
                    <>
                      <Link to={`${resourceBaseUrl}`}>
                        <FlexItem
                          itemsAlign={EnumItemsAlign.Center}
                          gap={EnumGapSize.Small}
                          className={`${CLASS_NAME}__header__title__service`}
                        >
                          <Icon
                            icon={
                              resourceThemeMap[currentResource?.resourceType]
                                ?.icon
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
                          <TruncatedId id={buildData.build.commitId} />
                        </span>
                      </h3>
                    </>
                  }
                ></FlexItem>
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
