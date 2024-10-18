import React, { useState, useCallback, useContext } from "react";
import PageContent from "../Layout/PageContent";
import PendingChangeWithCompare from "./PendingChangeWithCompare";
import { EnumCompareType } from "./PendingChangeDiffEntity";
import { MultiStateToggle, Snackbar } from "@amplication/ui/design-system";
import "./PendingChangesPage.scss";
import { AppContext } from "../context/appContext";
import usePendingChanges from "../Workspaces/hooks/usePendingChanges";
import { formatError } from "../util/error";
import { useProjectBaseUrl } from "../util/useProjectBaseUrl";
import { EnumResourceTypeGroup } from "../models";

const CLASS_NAME = "pending-changes-page";
const SPLIT = "Split";
const UNIFIED = "Unified";

const OPTIONS = [
  { value: UNIFIED, label: UNIFIED },
  { value: SPLIT, label: SPLIT },
];

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
              <div className={`${CLASS_NAME}__title`}>
                {resourceChanges.resource.name}
              </div>
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
