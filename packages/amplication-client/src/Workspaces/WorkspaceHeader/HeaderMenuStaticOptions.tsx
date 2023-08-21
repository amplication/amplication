import { Icon, SelectMenuItem } from "@amplication/ui/design-system";
import React, { useMemo } from "react";
import { useRouteMatch } from "react-router-dom";

import {
  WORK_SPACE_HEADER_CLASS_NAME,
  PROJECT_CONFIGURATION_RESOURCE_NAME,
} from "./WorkspaceHeader";

type Props = {
  currentProjectConfigurationId: string | undefined;
  currentWorkspaceId: string | undefined;
  currentProjectId: string;
  path: string | undefined;
  history: any;
};

export default function HeaderMenuStaticOptions({
  currentProjectConfigurationId,
  currentProjectId,
  currentWorkspaceId,
  history,
  path,
}: Props) {
  const MENU_OPTIONS = useMemo(
    () => [
      {
        title: PROJECT_CONFIGURATION_RESOURCE_NAME,
        link: `${currentProjectConfigurationId}/settings/update`,
        icon: "app-settings",
      },
      {
        title: "Commits",
        link: `commits`,
        icon: "history_commit_outline",
      },
      {
        title: "View Code",
        link: `code-view`,
        icon: "code1",
      },
    ],
    [currentProjectConfigurationId]
  );

  const match = useRouteMatch();

  return (
    <>
      {MENU_OPTIONS.map((option, index) => {
        const link = [match.url, currentProjectId, option.link].join("/");

        return (
          <SelectMenuItem
            closeAfterSelectionChange
            selected={path === link}
            key={index}
            onSelectionChange={() => {
              history.push(link);
            }}
          >
            <div
              className={`${WORK_SPACE_HEADER_CLASS_NAME}__breadcrumbs__resource__item`}
            >
              <Icon
                icon={option.icon}
                size={"small"}
                className={`${WORK_SPACE_HEADER_CLASS_NAME}__breadcrumbs__resource__icon`}
              />
              <span
                className={`${WORK_SPACE_HEADER_CLASS_NAME}__breadcrumbs__resource__text`}
              >
                {option.title}
              </span>
            </div>
          </SelectMenuItem>
        );
      })}
    </>
  );
}
