import {
  CircularProgress,
  EnumPanelStyle,
  EnumVersionTagState,
  Panel,
  Snackbar,
  VersionTag,
} from "@amplication/ui/design-system";
import { useRouteMatch } from "react-router-dom";
import { formatError } from "../util/error";
import useOutdatedVersionAlert from "./hooks/useOutdatedVersionAlert";
import PageContent from "../Layout/PageContent";
import ResourceCircleBadge from "../Components/ResourceCircleBadge";
import ResourceNameLink from "../Workspaces/ResourceNameLink";
import OutdatedVersionAlertType from "./OutdatedVersionAlertType";
import OutdatedVersionAlertStatus from "./OutdatedVersionAlertStatus";
import UpgradeServiceToLatestTemplateVersionButton from "../ServiceTemplate/UpgradeServiceToLatestTemplateVersionButton";

const CLASS_NAME = "outdated-version-page";
const PAGE_TITLE = "Tech Debt Alert";

function OutdatedVersionPage() {
  const match = useRouteMatch<{
    alert: string;
  }>([
    "/:workspace/platform/:project/tech-debt/:alert",
    "/:workspace/:project/:resource/tech-debt/:alert",
  ]);

  const { alert: alertId } = match?.params ?? {};

  const {
    outdatedVersionAlert: data,
    loadingOutdatedVersionAlert: loading,
    errorOutdatedVersionAlert: error,
    reloadOutdatedVersionAlert: reload,
  } = useOutdatedVersionAlert(alertId);

  const errorMessage = formatError(error);

  return (
    <PageContent className={CLASS_NAME} pageTitle={PAGE_TITLE}>
      {loading ? (
        <CircularProgress centerToParent />
      ) : !data ? (
        "No Alert Found"
      ) : (
        <Panel panelStyle={EnumPanelStyle.Bordered}>
          <ResourceCircleBadge type={data.resource.resourceType} size="small" />
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
      )}

      <Snackbar open={Boolean(error)} message={errorMessage} />
    </PageContent>
  );
}

export default OutdatedVersionPage;
