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
        onClick={handleOpen}
      >
        {currentWorkspace ? (
          <>
            <FlexItem itemsAlign={EnumItemsAlign.Center}>
              <Text textStyle={EnumTextStyle.H3}>{currentWorkspace.name}</Text>
              <Button
                buttonStyle={EnumButtonStyle.Text}
                type="button"
                icon={isOpen ? "chevron_up" : "chevron_down"}
                iconSize="xsmall"
              />
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
        />
      )}
    </div>
  );
}

export default WorkspaceSelector;
