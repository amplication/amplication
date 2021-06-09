import { CircleBadge } from "@amplication/design-system";
import classNames from "classnames";
import React, { useCallback } from "react";
import * as models from "../models";
import { COLOR } from "./WorkspaceSelector";

const CLASS_NAME = "workspaces-selector__list__item";

type Props = {
  workspace: models.Workspace;
  selected: boolean;
  onWorkspaceSelected: (workspace: models.Workspace) => void;
};

function WorkspaceSelectorListItem({
  workspace,
  selected,
  onWorkspaceSelected,
}: Props) {
  const handleClick = useCallback(() => {
    onWorkspaceSelected && onWorkspaceSelected(workspace);
  }, [onWorkspaceSelected, workspace]);

  return (
    <div
      className={classNames(`${CLASS_NAME}`, {
        [`${CLASS_NAME}--active`]: selected,
      })}
      onClick={handleClick}
    >
      <CircleBadge name={workspace.name} color={COLOR} />

      <span className={`${CLASS_NAME}__name`}>{workspace.name}</span>
    </div>
  );
}

export default WorkspaceSelectorListItem;
