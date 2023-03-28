import { CircleBadge, Icon } from "@amplication/ui/design-system";
import classNames from "classnames";
import React, { useCallback } from "react";
import * as models from "../models";
import { FREE_WORKSPACE_COLOR, getWorkspaceColor } from "./WorkspaceSelector";

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
      <CircleBadge
        name={workspace.name}
        color={getWorkspaceColor(workspace.subscription?.subscriptionPlan)}
      />
      <div className={`${CLASS_NAME}__details`}>
        <span className={`${CLASS_NAME}__name`}>{workspace.name}</span>
        <span
          className={classNames(
            `${CLASS_NAME}__plan`,
            workspace.subscription?.subscriptionPlan?.toLocaleLowerCase()
          )}
        >
          {workspace.subscription?.subscriptionPlan ||
            models.EnumSubscriptionPlan.Free}{" "}
          Plan
        </span>
      </div>
      {selected && (
        <Icon icon="check" size="xsmall" className={`${CLASS_NAME}__icon`} />
      )}
    </div>
  );
}

export default WorkspaceSelectorListItem;
