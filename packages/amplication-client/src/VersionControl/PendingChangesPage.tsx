import {
  EnumFlexItemMargin,
  FlexItem,
  HorizontalRule,
  Snackbar,
} from "@amplication/ui/design-system";
import { useContext } from "react";
import { AppContext } from "../context/appContext";
import PageContent from "../Layout/PageContent";
import { EnumResourceTypeGroup } from "../models";
import { formatError } from "../util/error";
import { useProjectBaseUrl } from "../util/useProjectBaseUrl";
import usePendingChanges from "../Workspaces/hooks/usePendingChanges";
import ResourceNameLink from "../Workspaces/ResourceNameLink";
import { EnumCompareType } from "./PendingChangeDiffEntity";
import "./PendingChangesPage.scss";
import PendingChangeWithCompare from "./PendingChangeWithCompare";
import ResourceTypeBadge from "../Components/ResourceTypeBadge";
import useBreadcrumbs from "../Layout/useBreadcrumbs";
import { AppRouteProps } from "../routes/routesUtil";
import { match } from "react-router-dom";

const CLASS_NAME = "pending-changes-page";

type Props = AppRouteProps & {
  match: match<{
    projectId: string;
  }>;
};

const PendingChangesPage = ({ match }: Props) => {
  const pageTitle = "Pending Changes";
  const { currentProject } = useContext(AppContext);

  const { isPlatformConsole } = useProjectBaseUrl();
  useBreadcrumbs("Pending Changes", match.url);

  const {
    pendingChangesByResource,
    pendingChangesDataError,
    pendingChangesIsError,
  } = usePendingChanges(
    currentProject,
    isPlatformConsole
      ? EnumResourceTypeGroup.Platform
      : EnumResourceTypeGroup.Services
  );

  const errorMessage = formatError(pendingChangesDataError);

  return (
    <>
      <PageContent
        className={CLASS_NAME}
        pageTitle={pageTitle}
        contentTitle="Pending Changes"
      >
        <div className={`${CLASS_NAME}__changes`}>
          {pendingChangesByResource.map((resourceChanges) => (
            <div key={resourceChanges.resource.id}>
              <FlexItem margin={EnumFlexItemMargin.Both}>
                <ResourceTypeBadge
                  resource={resourceChanges.resource}
                  size="small"
                />
                <ResourceNameLink resource={resourceChanges.resource} />
              </FlexItem>
              <HorizontalRule />
              {resourceChanges.changes.map((change) => (
                <PendingChangeWithCompare
                  key={change.originId}
                  change={change}
                  compareType={EnumCompareType.Pending}
                />
              ))}
            </div>
          ))}
          <div />
        </div>
      </PageContent>
      <Snackbar open={Boolean(pendingChangesIsError)} message={errorMessage} />
    </>
  );
};

export default PendingChangesPage;
