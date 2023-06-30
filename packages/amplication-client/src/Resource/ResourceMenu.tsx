import { CircleBadge, Popover } from "@amplication/ui/design-system";
import React, { useContext } from "react";
import { AppContext } from "../context/appContext";
import MenuItem from "../Layout/MenuItem";
import { EnumResourceType } from "../models";
import { useTracking } from "../util/analytics";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import { resourceThemeMap } from "./constants";
import "./ResourceMenu.scss";
import {
  linksMap,
  MenuItemLinks,
  resourceMenuLayout,
  setResourceUrlLink,
} from "./resourceMenuUtils";
import PurchaseMenuItem from "./PurchaseMenuItem";

const CLASS_NAME = "resource-menu";

// eslint-disable-next-line @typescript-eslint/ban-types
const ResourceMenu: React.FC<{}> = () => {
  const { currentWorkspace, currentProject, currentResource } =
    useContext(AppContext);

  const { trackEvent } = useTracking();
  const handleMenuClick = (title: string) => {
    trackEvent({
      eventName: AnalyticsEventNames.MenuItemClick,
      menuItem: title,
    });
  };

  return (
    <div className={CLASS_NAME}>
      {currentWorkspace && currentProject && currentResource && (
        <>
          <div className="menu-container">
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
                color={resourceThemeMap[currentResource.resourceType].color}
              />
            </MenuItem>

            {resourceMenuLayout[
              EnumResourceType[currentResource.resourceType]
            ].map((menuItem: string) => {
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
                  onClick={() => handleMenuClick(menuParams.title)}
                />
              );
            })}
          </div>
          <div className="bottom-menu-container">
            <PurchaseMenuItem />
          </div>
        </>
      )}
    </div>
  );
};

export default ResourceMenu;
