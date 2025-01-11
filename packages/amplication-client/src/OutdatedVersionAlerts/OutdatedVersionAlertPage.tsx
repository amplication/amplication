import {
  CircularProgress,
  EnumFlexDirection,
  EnumItemsAlign,
  EnumTextStyle,
  EnumVersionTagState,
  FlexItem,
  HeaderItemsStripe,
  HeaderItemsStripeItem,
  HorizontalRule,
  Snackbar,
  TabContentTitle,
  Text,
  VersionTag,
} from "@amplication/ui/design-system";
import { useRouteMatch } from "react-router-dom";
import { AutoBackNavigation } from "../Components/AutoBackNavigation";
import ResourceCircleBadge from "../Components/ResourceCircleBadge";
import { useAppContext } from "../context/appContext";
import PageContent, { EnumPageWidth } from "../Layout/PageContent";
import {
  EnumOutdatedVersionAlertStatus,
  EnumOutdatedVersionAlertType,
} from "../models";
import CompareResourceVersions from "../Platform/CompareResourceVersions";
import UpgradeServiceToLatestTemplateVersionButton from "../ServiceTemplate/UpgradeServiceToLatestTemplateVersionButton";
import { formatError } from "../util/error";
import ResourceNameLink from "../Workspaces/ResourceNameLink";
import { AlertStatusSelector } from "./AlertStatusSelector";
import useOutdatedVersionAlert from "./hooks/useOutdatedVersionAlert";
import OutdatedVersionAlertType from "./OutdatedVersionAlertType";
import ResourceTypeBadge from "../Components/ResourceTypeBadge";

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
    updateAlert,
    updateError,
    updateLoading,
  } = useOutdatedVersionAlert(alertId);

  const updateAlertStatus = async (status: EnumOutdatedVersionAlertStatus) => {
    if (!data) {
      return;
    }
    await updateAlert({
      variables: {
        id: data.id,
        data: {
          status,
        },
      },
    }).catch(console.error);
  };

  const errorMessage = formatError(error) || formatError(updateError);

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
              <ResourceTypeBadge resource={data.resource} size="small" />
              <ResourceNameLink resource={data.resource} />
            </FlexItem>
            <FlexItem
              direction={EnumFlexDirection.Row}
              itemsAlign={EnumItemsAlign.Center}
            >
              <FlexItem.FlexStart>
                <HeaderItemsStripe>
                  <HeaderItemsStripeItem
                    label="Alert Type"
                    content={<OutdatedVersionAlertType type={data.type} />}
                  />
                  {data.type === EnumOutdatedVersionAlertType.PluginVersion && (
                    <HeaderItemsStripeItem
                      label="Plugin"
                      content={
                        <Text textStyle={EnumTextStyle.Description}>
                          {data.block?.displayName}
                        </Text>
                      }
                    />
                  )}

                  <HeaderItemsStripeItem
                    label="Outdated Version"
                    content={
                      <VersionTag
                        version={data.outdatedVersion}
                        state={EnumVersionTagState.UpdateAvailable}
                      />
                    }
                  />
                  <HeaderItemsStripeItem
                    label="Latest Version"
                    content={
                      <VersionTag
                        version={data.latestVersion}
                        state={EnumVersionTagState.Current}
                      />
                    }
                  />
                  <HeaderItemsStripeItem
                    label="Status"
                    content={
                      <AlertStatusSelector
                        onChange={(value) => {
                          updateAlertStatus(value);
                        }}
                        selectedValue={data.status}
                        disabled={updateLoading}
                      />
                    }
                  />
                </HeaderItemsStripe>
              </FlexItem.FlexStart>
              <FlexItem.FlexEnd>
                {data.type === EnumOutdatedVersionAlertType.TemplateVersion &&
                  data.status === EnumOutdatedVersionAlertStatus.New && (
                    <UpgradeServiceToLatestTemplateVersionButton
                      resourceId={data.resource.id}
                    />
                  )}
              </FlexItem.FlexEnd>
            </FlexItem>
          </FlexItem>

          <HorizontalRule doubleSpacing />
          <CompareResourceVersions
            resourceId={currentResource?.serviceTemplate?.id}
            sourceVersion={data.outdatedVersion}
            targetVersion={data.latestVersion}
          />
        </>
      )}

      <Snackbar
        open={Boolean(error) || Boolean(updateError)}
        message={errorMessage}
      />
    </PageContent>
  );
}

export default OutdatedVersionPage;
