import {
  EnumFlexItemMargin,
  FlexItem,
  HorizontalRule,
  Snackbar,
} from "@amplication/ui/design-system";
import { useContext } from "react";
import ResourceCircleBadge from "../Components/ResourceCircleBadge";
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

const CLASS_NAME = "pending-changes-page";

const PendingChangesPage = () => {
  const pageTitle = "Pending Changes";
  const { currentProject } = useContext(AppContext);

  const { isPlatformConsole } = useProjectBaseUrl();

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
