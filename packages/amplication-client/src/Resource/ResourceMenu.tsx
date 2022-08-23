import { CircleBadge } from "@amplication/design-system";
import React, { useContext } from "react";
import { AppContext } from "../context/appContext";
import MenuItem from "../Layout/MenuItem";
import { EnumResourceType } from "../models";
import {
  linksMap,
  MenuItemLinks,
  resourceMenuLayout,
  setResourceUrlLink,
} from "./resourceMenuUtils";
import "./ResourceMenu.scss";

const CLASS_NAME = "resource-menu";

const ResourceMenu: React.FC<{}> = () => {
  const {
    currentWorkspace,
    currentProject,
    currentResource,
    currentProjectConfiguration,
  } = useContext(AppContext);

  const currentEntity = currentResource || currentProjectConfiguration;

  return (
    <div className={CLASS_NAME}>
      {currentWorkspace && currentProject && currentEntity && (
        <>
          <MenuItem
            className={`${CLASS_NAME}__app-icon`}
            title="Dashboard"
            disableHover
            to={setResourceUrlLink(
              currentWorkspace.id,
              currentProject.id,
              currentEntity.id,
              "/"
            )}
          >
            <CircleBadge
              name={currentEntity.name || ""}
              color={currentEntity.color}
            />
          </MenuItem>
          {resourceMenuLayout[EnumResourceType[currentEntity.resourceType]].map(
            (menuItem: string) => {
              const menuParams = linksMap[menuItem as MenuItemLinks];
              return (
                <MenuItem
                  key={menuParams.title}
                  title={menuParams.title}
                  to={setResourceUrlLink(
                    currentWorkspace.id,
                    currentProject.id,
                    currentEntity.id,
                    menuParams.to
                  )}
                  icon={menuParams.icon}
                />
              );
            }
          )}
        </>
      )}
    </div>
  );
};

export default ResourceMenu;
