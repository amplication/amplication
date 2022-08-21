import { EnumResourceType } from "../models";

export type MenuItemLinks = "entities" | "roles" | "github" | "settings";

export const resourceMenuLayout: { [key: string]: string[] } = {
  [EnumResourceType.Service]: ["entities", "roles", "github", "settings"],
  [EnumResourceType.ProjectConfiguration]: ["github", "settings"],
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
  github: {
    title: "Connect to GitHub",
    icon: "github",
    to: "/github",
  },
  settings: {
    title: "Settings",
    icon: "settings",
    to: "/settings/update",
  },
};

export const setResourceUrlLink = (
  workspace: string,
  project: string,
  resource: string,
  iconUrl: string
) => `/${workspace}/${project}/${resource}${iconUrl}`;
