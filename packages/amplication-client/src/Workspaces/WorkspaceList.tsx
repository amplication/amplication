import { useContext, useEffect } from "react";
import * as models from "../models";
import { AppContext } from "../context/appContext";
import {
  EnumButtonStyle,
  SelectMenu,
  SelectMenuItem,
  SelectMenuList,
  SelectMenuModal,
} from "@amplication/design-system";
import "./WorkspaceListItem.scss";

const CLASS_NAME = "workspaces__list__item";

type Props = {
  selectedWorkspace: models.Workspace;
  onWorkspaceSelected: (workspace: models.Workspace) => void;
};

function WorkspaceList({ selectedWorkspace, onWorkspaceSelected }: Props) {
  const { getWorkspaces, workspacesList } = useContext(AppContext);

  useEffect(() => {
    getWorkspaces();
  }, []);

  return (
    <div className={`${CLASS_NAME}__header`}>
      <p>Select workspace</p>
      <SelectMenu
        title={selectedWorkspace.name}
        buttonStyle={EnumButtonStyle.Text}
        className={`${CLASS_NAME}__menu`}
        icon="chevron_down"
      >
        <SelectMenuModal>
          <div className={`${CLASS_NAME}__select-menu`}>
            <SelectMenuList>
              <>
                {workspacesList.map((workspace) => (
                  <SelectMenuItem
                    closeAfterSelectionChange
                    selected={selectedWorkspace.id === workspace.id}
                    key={workspace.id}
                    onSelectionChange={() => {
                      onWorkspaceSelected(workspace);
                    }}
                  >
                    {workspace.name}
                  </SelectMenuItem>
                ))}
              </>
            </SelectMenuList>
          </div>
        </SelectMenuModal>
      </SelectMenu>
    </div>
  );
}

export default WorkspaceList;
