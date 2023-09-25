import { EnumResourceType } from "../models";

export type MenuItemLinks = "entities" | "roles" | "git" | "settings";

export const resourceMenuLayout: { [key: string]: string[] } = {
  [EnumResourceType.Service]: [
    "entities",
    "roles",
    "connections",
    "git",
    "settings",
    "plugins",
  ],
  [EnumResourceType.ProjectConfiguration]: ["git", "settings"],
  [EnumResourceType.MessageBroker]: ["topics", "services", "git", "settings"],
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
  git: {
    title: "Sync with Git provider",
    icon: "pending_changes",
    to: "/git-sync",
  },
  settings: {
    title: "Settings",
    icon: "settings",
    to: "/settings/update",
  },
  plugins: {
    title: "Plugins",
    icon: "plugins",
    to: "/plugins",
  },
  topics: {
    title: "Topics",
    icon: "topic",
    to: "/topics",
  },
  services: {
    title: "Services",
    icon: "services",
    to: "/services",
  },
  connections: {
    title: "Connections",
    icon: "connection",
    to: "/service-connections",
  },
};

export const setResourceUrlLink = (
  workspace: string,
  project: string,
  resource: string,
  iconUrl: string
): string => `/${workspace}/${project}/${resource}${iconUrl}`;
