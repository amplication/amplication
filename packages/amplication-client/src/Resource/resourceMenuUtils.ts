import { EnumResourceType } from "../models";

export type MenuItemLinks = "entities" | "roles" | "github" | "settings";

export const resourceMenuLayout: { [key in EnumResourceType]: string[] } = {
  [EnumResourceType.Service]: [
    "entities",
    "roles",
    "connections",
    "github",
    "settings",
  ],
  [EnumResourceType.ProjectConfiguration]: ["github", "settings"],
  [EnumResourceType.MessageBroker]: ["topics", "github", "settings"],
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
  topics: {
    title: "Topics",
    icon: "plus",
    to: "/topics",
  },
  connections: {
    title: "Connections",
    icon: "link_2",
    to: "/service-connections",
  },
};

export const setResourceUrlLink = (
  workspace: string,
  project: string,
  resource: string,
  iconUrl: string
) => `/${workspace}/${project}/${resource}${iconUrl}`;
