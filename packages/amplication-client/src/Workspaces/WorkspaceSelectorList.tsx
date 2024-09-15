import {
  CircularProgress,
  EnumIconPosition,
} from "@amplication/ui/design-system";
import React, { useMemo } from "react";
import { Button, EnumButtonStyle } from "../Components/Button";
import * as models from "../models";
import WorkspaceSelectorListItem from "./WorkspaceSelectorListItem";
import { BillingFeature } from "@amplication/util-billing-types";
import { useStiggContext } from "@stigg/react-sdk";

const CLASS_NAME = "workspaces-selector__list";

type Props = {
  selectedWorkspace: models.Workspace;
  onWorkspaceSelected: (workspaceId: string) => void;
  onNewWorkspaceClick: () => void;
  workspaces: models.Workspace[];
  loadingWorkspaces: boolean;
};

function WorkspaceSelectorList({
  selectedWorkspace,
  onWorkspaceSelected,
  onNewWorkspaceClick,
  workspaces,
  loadingWorkspaces,
}: Props) {
  const { stigg } = useStiggContext();

  const createWorkspaceEntitlement = stigg.getBooleanEntitlement({
    featureId: BillingFeature.AllowWorkspaceCreation,
  }).hasAccess;

  //order workspaces by subscription plan
  const orderedWorkspaces = useMemo(() => {
    if (!workspaces) {
      return [];
    }
    return workspaces.sort((a, b) => {
      if (
        a.subscription?.subscriptionPlan === b.subscription?.subscriptionPlan
      ) {
        return a.name.localeCompare(b.name);
      }
      return a.subscription?.subscriptionPlan.localeCompare(
        b.subscription?.subscriptionPlan
      );
    });
  }, [workspaces]);

  return (
    <div className={CLASS_NAME}>
      {loadingWorkspaces ? (
        <CircularProgress centerToParent />
      ) : (
        <>
          {orderedWorkspaces.map((workspace) => (
            <WorkspaceSelectorListItem
              onWorkspaceSelected={onWorkspaceSelected}
              workspace={workspace}
              selected={selectedWorkspace.id === workspace.id}
              key={workspace.id}
            />
          ))}

          {createWorkspaceEntitlement && (
            <>
              <hr className={`${CLASS_NAME}__divider`} />
              <div className={`${CLASS_NAME}__new`}>
                <Button
                  buttonStyle={EnumButtonStyle.Text}
                  disabled={loadingWorkspaces}
                  type="button"
                  icon="plus"
                  className={`${CLASS_NAME}__button`}
                  iconPosition={EnumIconPosition.Left}
                  onClick={onNewWorkspaceClick}
                >
                  Create new workspace
                </Button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default WorkspaceSelectorList;
