import { CircleBadge, Icon } from "@amplication/design-system";
import classNames from "classnames";
import React, { useCallback } from "react";
import * as models from "../models";
import { WORKSPACE_COLOR } from "./WorkspaceSelector";

const CLASS_NAME = "workspaces-selector__list__item";

type Props = {
  workspace: models.Workspace;
  selected: boolean;
  onWorkspaceSelected: (workspaceId: string) => void;
};

function WorkspaceSelectorListItem({
  workspace,
  selected,
  onWorkspaceSelected,
}: Props) {
  const handleClick = useCallback(() => {
    onWorkspaceSelected && onWorkspaceSelected(workspace.id);
  }, [onWorkspaceSelected, workspace]);

  return (
    <div
      className={classNames(`${CLASS_NAME}`, {
        [`${CLASS_NAME}--active`]: selected,
      })}
      onClick={handleClick}
    >
      <CircleBadge name={workspace.name} color={WORKSPACE_COLOR} />
      <div className={`${CLASS_NAME}__details`}>
        <span className={`${CLASS_NAME}__name`}>{workspace.name}</span>
        <span className={`${CLASS_NAME}__plan`}>
          {workspace.subscription?.subscriptionPlan || "Community"} Plan
        </span>
      </div>
      {selected && (
        <Icon icon="check" size="xsmall" className={`${CLASS_NAME}__icon`} />
      )}
    </div>
  );
}

export default WorkspaceSelectorListItem;
