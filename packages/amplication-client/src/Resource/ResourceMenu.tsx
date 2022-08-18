import { CircleBadge, CircularProgress } from "@amplication/design-system";
import classNames from "classnames";
import React, { useContext } from "react";
import { AppContext } from "../context/appContext";
import MenuItem from "../Layout/MenuItem";
import { EnumResourceType } from "../models";
import { LEFT_MENU_CLASS_NAME } from "./constants";
import {
  linksMap,
  MenuItemLinks,
  resourceMenuLayout,
  setResourceUrlLink,
} from "./resourceMenuUtils";

const CLASS_NAME = "resource-menu";

const ResourceMenu: React.FC<{}> = () => {
  const { currentWorkspace, currentProject, currentResource } = useContext(
    AppContext
  );

  return currentWorkspace && currentProject && currentResource ? (
    <div className={classNames([CLASS_NAME, LEFT_MENU_CLASS_NAME])}>
      <MenuItem
        className={`${CLASS_NAME}__app-icon`}
        title="Dashboard"
        disableHover
        to={setResourceUrlLink(
          currentWorkspace.id,
          currentProject.id,
          currentResource.id,
          "/"
        )}
      >
        <CircleBadge
          name={currentResource.name || ""}
          color={currentResource.color}
        />
      </MenuItem>
      {resourceMenuLayout[EnumResourceType[currentResource.resourceType]].map(
        (menuItem: string) => {
          const menuParams = linksMap[menuItem as MenuItemLinks];
          return (
            <MenuItem
              key={menuParams.title}
              title={menuParams.title}
              to={setResourceUrlLink(
                currentWorkspace.id,
                currentProject.id,
                currentResource.id,
                menuParams.to
              )}
              icon={menuParams.icon}
            />
          );
        }
      )}
    </div>
  ) : (
    <CircularProgress />
  );
};

export default ResourceMenu;
