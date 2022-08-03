import { EnumResourceType } from "../models";

export type MenuItemLinks =
  | "entities"
  | "roles"
  | "commits"
  | "github"
  | "code"
  | "settings";

export const resourceMenuLayout: { [key: string]: string[] } = {
  [EnumResourceType.Service]: [
    "entities",
    "roles",
    "commits",
    "github",
    "code",
    "settings",
  ],
};

export const linksMap = {
  entities: {
    title: "Entities",
    icon: "entity_outline",
    to: "/entities",
  },
  roles: {
    title: "Roles",
    icon: "roles_outline",
    to: "/roles",
  },
  commits: {
    title: "Commits",
    icon: "history_commit_outline",
    to: "/commits",
  },
  github: {
    title: "Connect to GitHub",
    icon: "github",
    to: "/github",
  },
  code: {
    title: "Code View",
    icon: "code1",
    to: "/code-view",
  },
  settings: {
    title: "Settings",
    icon: "settings",
    to: "/resourceSettings/update",
  },
};

export const setResourceUrlLink = (
  workspace: string,
  project: string,
  resource: string,
  iconUrl: string
) => `/${workspace}/${project}/${resource}${iconUrl}`;
