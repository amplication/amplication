import {
  CircleBadge,
  EnumTextColor,
  Icon,
  TabItem,
} from "@amplication/ui/design-system";
import classNames from "classnames";
import React, { useContext, useMemo } from "react";

import MenuItem from "../Layout/MenuItem";
import useProjectRoutes from "../Layout/useProjectRoutes";
import { AppContext } from "../context/appContext";
import { EnumResourceType } from "../models";
import { RouteDef } from "../routes/appRoutes";
import { useTracking } from "../util/analytics";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import { useProjectBaseUrl } from "../util/useProjectBaseUrl";
import "./ProjectMenu.scss";
const CLASS_NAME = "project-menu";

export const CATALOG_COLOR = "#A787FF";
export const PLATFORM_COLOR = "#f6aa50";

type Props = {
  routeDefs: RouteDef[];
};

// eslint-disable-next-line @typescript-eslint/ban-types
const ProjectMenu: React.FC<Props> = ({ routeDefs }) => {
  const allTabs = useProjectRoutes(routeDefs);

  const { pendingChanges } = useContext(AppContext);

  const { isPlatformConsole } = useProjectBaseUrl();
  const { baseUrl: platformBaseUrl } = useProjectBaseUrl({
    overrideIsPlatformConsole: true,
  });

  const { baseUrl: catalogBaseUrl } = useProjectBaseUrl({
    overrideIsPlatformConsole: false,
  });

  //count how many unique resources in the pending changes
  const publishCount = useMemo(() => {
    return pendingChanges?.reduce((acc, change) => {
      if (change.resource.resourceType === EnumResourceType.PluginRepository) {
        acc.push(change.originId);
      } else if (!acc.includes(change.resource.id)) {
        acc.push(change.resource.id);
      }
      return acc;
    }, [] as string[]).length;
  }, [pendingChanges]);

  const projectTabs: TabItem[] = useMemo(() => {
    const tabsWithPendingChanges = allTabs.projectTabs.map((tab) => {
      if (tab.name === "Publish") {
        return {
          ...tab,
          indicatorValue: publishCount > 0 ? publishCount : undefined,
          indicatorColor: EnumTextColor.White,
        };
      }
      if (tab.name === "Pending Changes") {
        return {
          ...tab,
          indicatorValue: pendingChanges?.length
            ? pendingChanges.length
            : undefined,
          indicatorColor: EnumTextColor.White,
        };
      }
      return tab;
    });

    return tabsWithPendingChanges || [];
  }, [publishCount, allTabs, pendingChanges]);

  const platformTabs: TabItem[] = useMemo(() => {
    const tabsWithPendingChanges = allTabs.platformTabs.map((tab) => {
      if (tab.name === "Publish") {
        return {
          ...tab,
          indicatorValue: publishCount > 0 ? publishCount : undefined,
          indicatorColor: EnumTextColor.White,
        };
      }
      if (tab.name === "Pending Changes") {
        return {
          ...tab,
          name: "Platform Changes",
          indicatorValue: pendingChanges?.length
            ? pendingChanges.length
            : undefined,
          indicatorColor: EnumTextColor.White,
        };
      }
      return tab;
    });

    return tabsWithPendingChanges || [];
  }, [publishCount, allTabs, pendingChanges]);

  const { trackEvent } = useTracking();
  const handleMenuClick = (title: string) => {
    trackEvent({
      eventName: AnalyticsEventNames.MenuItemClick,
      menuItem: title,
    });
  };

  return (
    <div className={CLASS_NAME}>
      <div className="menu-container">
        <div>
          <MenuItem
            className={`${CLASS_NAME}__app-icon`}
            title={"Project Catalog"}
            to={catalogBaseUrl}
            disableHover
          >
            <CircleBadge color={CATALOG_COLOR}>
              <Icon icon={"services"} />
            </CircleBadge>
          </MenuItem>

          <div
            className={classNames("menu-container", {
              "menu-container--close": isPlatformConsole,
            })}
          >
            {projectTabs?.map((menuItem: TabItem) => {
              return (
                <MenuItem
                  key={menuItem.name}
                  title={menuItem.name}
                  to={menuItem.to}
                  icon={menuItem.iconName || "code"}
                  onClick={() => handleMenuClick(menuItem.name)}
                />
              );
            })}
          </div>
        </div>
        <div className="menu-container--inner">
          <MenuItem
            className={`${CLASS_NAME}__app-icon`}
            title={"Project Platform"}
            to={platformBaseUrl}
            disableHover
          >
            <CircleBadge color={PLATFORM_COLOR}>
              <Icon icon={"grid"} />
            </CircleBadge>
          </MenuItem>
          <div
            className={classNames("menu-container", {
              "menu-container--close": !isPlatformConsole,
            })}
          >
            {platformTabs?.map((menuItem: TabItem) => {
              return (
                <MenuItem
                  key={menuItem.name}
                  title={menuItem.name}
                  to={menuItem.to}
                  icon={menuItem.iconName || "code"}
                  onClick={() => handleMenuClick(menuItem.name)}
                />
              );
            })}
          </div>
        </div>
      </div>
      <div className="bottom-menu-container"></div>
    </div>
  );
};

export default ProjectMenu;
