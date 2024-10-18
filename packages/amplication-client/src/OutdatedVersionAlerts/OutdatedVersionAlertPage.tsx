import {
  CircularProgress,
  EnumContentAlign,
  EnumFlexDirection,
  EnumGapSize,
  EnumItemsAlign,
  EnumTextStyle,
  EnumVersionTagState,
  FlexItem,
  HorizontalRule,
  Snackbar,
  TabContentTitle,
  Text,
  VersionTag,
} from "@amplication/ui/design-system";
import { ReactNode } from "react";
import { useRouteMatch } from "react-router-dom";
import { AutoBackNavigation } from "../Components/AutoBackNavigation";
import ResourceCircleBadge from "../Components/ResourceCircleBadge";
import { useAppContext } from "../context/appContext";
import PageContent, { EnumPageWidth } from "../Layout/PageContent";
import { EnumOutdatedVersionAlertStatus } from "../models";
import useCompareResourceVersions from "../Platform/hooks/useCompareResourceVersions";
import UpgradeServiceToLatestTemplateVersionButton from "../ServiceTemplate/UpgradeServiceToLatestTemplateVersionButton";
import { formatError } from "../util/error";
import CompareBlockVersions from "../VersionControl/CompareBlockVersions";
import ResourceNameLink from "../Workspaces/ResourceNameLink";
import useOutdatedVersionAlert from "./hooks/useOutdatedVersionAlert";
import OutdatedVersionAlertStatus from "./OutdatedVersionAlertStatus";
import OutdatedVersionAlertType from "./OutdatedVersionAlertType";

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
          <FlexItem
            direction={EnumFlexDirection.Column}
            itemsAlign={EnumItemsAlign.Start}
          >
            <AutoBackNavigation />
            <TabContentTitle title="Version Update Alert" />
            <FlexItem
              direction={EnumFlexDirection.Row}
              itemsAlign={EnumItemsAlign.Center}
            >
              <ResourceCircleBadge
                type={data.resource.resourceType}
                size="small"
              />
              <ResourceNameLink resource={data.resource} />
            </FlexItem>
            <FlexItem
              direction={EnumFlexDirection.Row}
              itemsAlign={EnumItemsAlign.Center}
            >
              <FlexItem.FlexStart>
                <FlexItem
                  itemsAlign={EnumItemsAlign.Start}
                  contentAlign={EnumContentAlign.Start}
                  gap={EnumGapSize.Large}
                >
                  <HeaderItem
                    label="Alert Type"
                    content={<OutdatedVersionAlertType type={data.type} />}
                  />
                  <HeaderItem
                    label="Outdated Version"
                    content={
                      <VersionTag
                        version={data.outdatedVersion}
                        state={EnumVersionTagState.UpdateAvailable}
                      />
                    }
                  />
                  <HeaderItem
                    label="Latest Version"
                    content={
                      <VersionTag
                        version={data.latestVersion}
                        state={EnumVersionTagState.Current}
                      />
                    }
                  />
                  <HeaderItem
                    label="Status"
                    content={
                      <OutdatedVersionAlertStatus status={data.status} />
                    }
                  />
                </FlexItem>
              </FlexItem.FlexStart>
              <FlexItem.FlexEnd>
                {data.status === EnumOutdatedVersionAlertStatus.New && (
                  <UpgradeServiceToLatestTemplateVersionButton
                    resourceId={data.resource.id}
                  />
                )}
              </FlexItem.FlexEnd>
            </FlexItem>
          </FlexItem>

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
                  ></CompareBlockVersions>
                )
              )}
              {compareData?.compareResourceVersions?.deletedBlocks?.map(
                (block) => (
                  <CompareBlockVersions
                    oldVersion={block}
                    newVersion={null}
                    key={block.id}
                  ></CompareBlockVersions>
                )
              )}
              {compareData?.compareResourceVersions?.updatedBlocks?.map(
                (diff) => (
                  <CompareBlockVersions
                    oldVersion={diff.sourceBlockVersion}
                    newVersion={diff.targetBlockVersion}
                    key={diff.sourceBlockVersion.id}
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

type HeaderItemProps = {
  label: string;
  content: ReactNode;
};

function HeaderItem({ label, content }: HeaderItemProps) {
  return (
    <div>
      <FlexItem direction={EnumFlexDirection.Column}>
        <Text noWrap textStyle={EnumTextStyle.Description}>
          {label}
        </Text>

        {content}
      </FlexItem>
    </div>
  );
}

export default OutdatedVersionPage;
