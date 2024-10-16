import {
  CircularProgress,
  EnumContentAlign,
  EnumFlexDirection,
  EnumGapSize,
  EnumItemsAlign,
  EnumPanelStyle,
  EnumTextStyle,
  EnumVersionTagState,
  FlexItem,
  HorizontalRule,
  Panel,
  Snackbar,
  TabContentTitle,
  Text,
  VersionTag,
} from "@amplication/ui/design-system";
import { useRouteMatch } from "react-router-dom";
import { formatError } from "../util/error";
import useOutdatedVersionAlert from "./hooks/useOutdatedVersionAlert";
import PageContent, { EnumPageWidth } from "../Layout/PageContent";
import ResourceCircleBadge from "../Components/ResourceCircleBadge";
import ResourceNameLink from "../Workspaces/ResourceNameLink";
import OutdatedVersionAlertType from "./OutdatedVersionAlertType";
import OutdatedVersionAlertStatus from "./OutdatedVersionAlertStatus";
import UpgradeServiceToLatestTemplateVersionButton from "../ServiceTemplate/UpgradeServiceToLatestTemplateVersionButton";
import useCompareResourceVersions from "../Platform/hooks/useCompareResourceVersions";
import { useAppContext } from "../context/appContext";
import CompareBlockVersions from "../VersionControl/CompareBlockVersions";

const CLASS_NAME = "outdated-version-page";
const PAGE_TITLE = "Tech Debt Alert";

function OutdatedVersionPage() {
  const { currentResource } = useAppContext();

  const match = useRouteMatch<{
    alert: string;
  }>(["/:workspace/:project/:resource/tech-debt/:alert"]);

  const { alert: alertId } = match?.params ?? {};

  const {
    outdatedVersionAlert: data,
    loadingOutdatedVersionAlert: loading,
    errorOutdatedVersionAlert: error,
    reloadOutdatedVersionAlert: reload,
  } = useOutdatedVersionAlert(alertId);

  const {
    data: compareData,
    loading: compareLoading,
    error: compareError,
  } = useCompareResourceVersions(
    currentResource?.serviceTemplate?.id,
    data?.outdatedVersion,
    data?.latestVersion
  );

  const errorMessage = formatError(error) || formatError(compareError);

  return (
    <PageContent
      className={CLASS_NAME}
      pageTitle={PAGE_TITLE}
      pageWidth={EnumPageWidth.Full}
    >
      {loading ? (
        <CircularProgress centerToParent />
      ) : !data ? (
        "No Alert Found"
      ) : (
        <>
          <Panel panelStyle={EnumPanelStyle.Bordered}>
            <ResourceCircleBadge
              type={data.resource.resourceType}
              size="small"
            />
            <ResourceNameLink resource={data.resource} />
            <OutdatedVersionAlertType type={data.type} />
            <VersionTag
              version={data.outdatedVersion}
              state={EnumVersionTagState.UpdateAvailable}
            />
            <VersionTag
              version={data.latestVersion}
              state={EnumVersionTagState.Current}
            />
            <OutdatedVersionAlertStatus status={data.status} />

            <UpgradeServiceToLatestTemplateVersionButton
              resourceId={data.resource.id}
            />
          </Panel>
          <HorizontalRule doubleSpacing />
          {compareLoading ? (
            <CircularProgress centerToParent />
          ) : (
            <FlexItem
              direction={EnumFlexDirection.Column}
              gap={EnumGapSize.None}
              itemsAlign={EnumItemsAlign.Stretch}
              contentAlign={EnumContentAlign.Start}
            >
              {compareData?.compareResourceVersions?.createdBlocks?.map(
                (block) => (
                  <CompareBlockVersions
                    oldVersion={null}
                    newVersion={block}
                    key={block.id}
                    splitView={true}
                  ></CompareBlockVersions>
                )
              )}
              {compareData?.compareResourceVersions?.deletedBlocks?.map(
                (block) => (
                  <Text textStyle={EnumTextStyle.Tag} key={block.id}>
                    {block.displayName}
                  </Text>
                )
              )}
              {compareData?.compareResourceVersions?.updatedBlocks?.map(
                (diff) => (
                  <CompareBlockVersions
                    oldVersion={diff.sourceBlockVersion}
                    newVersion={diff.targetBlockVersion}
                    key={diff.sourceBlockVersion.id}
                    splitView={true}
                  ></CompareBlockVersions>
                )
              )}
            </FlexItem>
          )}
        </>
      )}

      <Snackbar
        open={Boolean(error) || Boolean(compareError)}
        message={errorMessage}
      />
    </PageContent>
  );
}

export default OutdatedVersionPage;
