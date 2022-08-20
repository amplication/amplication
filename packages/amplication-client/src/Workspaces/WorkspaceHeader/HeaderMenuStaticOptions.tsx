import { Icon, SelectMenuItem } from "@amplication/design-system";
import { join } from "path";
import React, { useMemo } from "react";
import { WORK_SPACE_HEADER_CLASS_NAME } from "./WorkspaceHeader";

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
        title: "Project settings",
        link: `${currentProjectConfigurationId}/settings/update`,
        icon: "app-settings",
      },
      {
        title: "Commits",
        link: `commits`,
        icon: "history_commit_outline",
      },
      {
        title: "View code",
        link: `code-view`,
        icon: "code1",
      },
    ],
    [currentProjectConfigurationId]
  );

  return (
    <>
      {MENU_OPTIONS.map((option, index) => {
        const link =
          "/" + join(currentWorkspaceId || "", currentProjectId, option.link);

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
