import { EnumResourceType } from "../models";

export type MenuItemLinks =
  | "entities"
  | "roles"
  | "git"
  | "settings"
  | "plugins"
  | "topics"
  | "services"
  | "connections"
  | "pendingChanges";

export const resourceMenuLayout: {
  [key in EnumResourceType]: MenuItemLinks[];
} = {
  [EnumResourceType.Service]: [
    "entities",
    "roles",
    "plugins",
    "git",
    "connections",
    "settings",
    "pendingChanges",
  ],
  [EnumResourceType.ProjectConfiguration]: [
    "git",
    "settings",
    "pendingChanges",
  ],
  [EnumResourceType.MessageBroker]: [
    "topics",
    "services",
    "git",
    "settings",
    "pendingChanges",
  ],
};

export const linksMap: {
  [key in MenuItemLinks]: { title: string; icon: string; to: string };
} = {
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
    to: "/settings",
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
  pendingChanges: {
    title: "Pending Changes",
    icon: "pending_changes",
    to: "/pending-changes",
  },
};

export const setResourceUrlLink = (
  workspace: string,
  project: string,
  resource: string,
  itemUrl: string
): string => `/${workspace}/${project}/${resource}${itemUrl}`;
