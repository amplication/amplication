import React, { useCallback, useContext, useState } from "react";
import classNames from "classnames";
import { Button, EnumButtonStyle } from "../Components/Button";
import {
  CircleBadge,
  Dialog,
  CircularProgress,
} from "@amplication/ui/design-system";
import WorkspaceSelectorList from "./WorkspaceSelectorList";
import NewWorkspace from "./NewWorkspace";
import "./WorkspaceSelector.scss";
import { AppContext } from "../context/appContext";
import { EnumSubscriptionPlan } from "../models";

export const FREE_WORKSPACE_COLOR = "#A787FF";
export const PRO_WORKSPACE_COLOR = "#20a4f3";
export const ENTERPRISE_WORKSPACE_COLOR = "#31c587";

export const getWorkspaceColor = (plan: EnumSubscriptionPlan) => {
  switch (plan) {
    case EnumSubscriptionPlan.Free:
      return FREE_WORKSPACE_COLOR;
    case EnumSubscriptionPlan.Pro:
      return PRO_WORKSPACE_COLOR;
    case EnumSubscriptionPlan.Enterprise:
      return ENTERPRISE_WORKSPACE_COLOR;
    default:
      return FREE_WORKSPACE_COLOR;
  }
};

const CLASS_NAME = "workspaces-selector";

function WorkspaceSelector() {
  const { currentWorkspace, handleSetCurrentWorkspace } =
    useContext(AppContext);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [newWorkspace, setNewWorkspace] = useState<boolean>(false);

  const handleNewWorkspaceClick = useCallback(() => {
    setNewWorkspace(!newWorkspace);
  }, [newWorkspace, setNewWorkspace]);

  const handleOpen = useCallback(() => {
    setIsOpen((isOpen) => {
      return !isOpen;
    });
  }, [setIsOpen]);

  return (
    <div
      className={`${CLASS_NAME}${
        isOpen ? ` ${CLASS_NAME}__open` : ` ${CLASS_NAME}__close`
      }`}
    >
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
        onClick={handleOpen}
      >
        {currentWorkspace ? (
          <>
            <CircleBadge
              name={currentWorkspace.name || ""}
              color={getWorkspaceColor(
                currentWorkspace.subscription?.subscriptionPlan
              )}
            />
            <div className={`${CLASS_NAME}__current__details`}>
              <span className={`${CLASS_NAME}__current__name`}>
                {currentWorkspace.name}
              </span>
              <span
                className={classNames(
                  `${CLASS_NAME}__current__plan`,
                  currentWorkspace.subscription?.subscriptionPlan?.toLocaleLowerCase()
                )}
              >
                {currentWorkspace.subscription?.subscriptionPlan ||
                  EnumSubscriptionPlan.Free}{" "}
                Plan
              </span>
            </div>
            <Button
              buttonStyle={EnumButtonStyle.Text}
              type="button"
              icon={isOpen ? "chevron_up" : "chevron_down"}
              iconSize="xsmall"
            />
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
        />
      )}
    </div>
  );
}

export default WorkspaceSelector;
