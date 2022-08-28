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
  } = useContext(AppContext);

  return (
    <div className={CLASS_NAME}>
      {currentWorkspace && currentProject && currentResource && (
        <>
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
        </>
      )}
    </div>
  );
};

export default ResourceMenu;
