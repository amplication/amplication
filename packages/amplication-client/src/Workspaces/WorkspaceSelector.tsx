import {
  CircularProgress,
  Dialog,
  EnumItemsAlign,
  EnumTextStyle,
  FlexItem,
  Text,
} from "@amplication/ui/design-system";
import classNames from "classnames";
import { useCallback, useContext, useState } from "react";
import { Button, EnumButtonStyle } from "../Components/Button";
import { AppContext } from "../context/appContext";
import { EnumSubscriptionPlan } from "../models";
import NewWorkspace from "./NewWorkspace";
import "./WorkspaceSelector.scss";
import WorkspaceSelectorList from "./WorkspaceSelectorList";
import { GET_WORKSPACES } from "./queries/workspaceQueries";
import { useQuery } from "@apollo/client";
import * as models from "../models";
import { useStiggContext } from "@stigg/react-sdk";
import { BillingFeature } from "@amplication/util-billing-types";

export const FREE_WORKSPACE_COLOR = "#A787FF";
export const PRO_WORKSPACE_COLOR = "#20a4f3";
export const ENTERPRISE_WORKSPACE_COLOR = "#31c587";

export const getWorkspaceColor = (plan: EnumSubscriptionPlan) => {
  switch (plan) {
    case EnumSubscriptionPlan.Free:
      return FREE_WORKSPACE_COLOR;
    case EnumSubscriptionPlan.Essential:
    case EnumSubscriptionPlan.Pro:
    case EnumSubscriptionPlan.Team:
      return PRO_WORKSPACE_COLOR;
    case EnumSubscriptionPlan.Enterprise:
      return ENTERPRISE_WORKSPACE_COLOR;
    default:
      return FREE_WORKSPACE_COLOR;
  }
};

type TData = {
  workspaces: models.Workspace[];
};

const CLASS_NAME = "workspaces-selector";

function WorkspaceSelector() {
  const { currentWorkspace, handleSetCurrentWorkspace } =
    useContext(AppContext);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [newWorkspace, setNewWorkspace] = useState<boolean>(false);

  const { data, loading } = useQuery<TData>(GET_WORKSPACES);

  const { stigg } = useStiggContext();

  const createWorkspaceEntitlement = stigg.getBooleanEntitlement({
    featureId: BillingFeature.AllowWorkspaceCreation,
  }).hasAccess;

  const handleNewWorkspaceClick = useCallback(() => {
    setNewWorkspace(!newWorkspace);
  }, [newWorkspace, setNewWorkspace]);

  const handleOpen = useCallback(() => {
    setIsOpen((isOpen) => {
      return !isOpen;
    });
  }, [setIsOpen]);

  return (
    <div className={`${CLASS_NAME}`}>
      <Dialog
        className="new-entity-dialog"
        isOpen={newWorkspace}
        onDismiss={handleNewWorkspaceClick}
        title="New Workspace"
      >
        <NewWorkspace />
      </Dialog>
      <div
        className={classNames(`${CLASS_NAME}__current`, {
          [`${CLASS_NAME}__current--active`]: isOpen,
        })}
        onClick={
          createWorkspaceEntitlement || data?.workspaces?.length > 1
            ? handleOpen
            : () => {}
        }
      >
        {currentWorkspace ? (
          <>
            <FlexItem itemsAlign={EnumItemsAlign.Center}>
              <Text textStyle={EnumTextStyle.H3}>{currentWorkspace.name}</Text>
              {(createWorkspaceEntitlement || data?.workspaces?.length > 1) && (
                <Button
                  buttonStyle={EnumButtonStyle.Text}
                  type="button"
                  icon={isOpen ? "chevron_up" : "chevron_down"}
                  iconSize="xsmall"
                />
              )}
            </FlexItem>
          </>
        ) : (
          <CircularProgress centerToParent />
        )}
      </div>
      {isOpen && currentWorkspace && (
        <WorkspaceSelectorList
          onNewWorkspaceClick={handleNewWorkspaceClick}
          selectedWorkspace={currentWorkspace}
          onWorkspaceSelected={handleSetCurrentWorkspace}
          workspaces={data.workspaces}
          loadingWorkspaces={loading}
        />
      )}
    </div>
  );
}

export default WorkspaceSelector;
