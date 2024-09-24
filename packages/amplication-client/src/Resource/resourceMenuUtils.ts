import { BillingFeature } from "@amplication/util-billing-types";
import { EnumResourceType } from "../models";

export type MenuItemLinks =
  | "entities"
  | "roles"
  | "git"
  | "git2"
  | "settings"
  | "plugins"
  | "topics"
  | "services"
  | "connections"
  | "modules"
  | "privatePlugins"
  | "pendingChanges";

export const resourceMenuLayout: {
  [key in EnumResourceType]: MenuItemLinks[];
} = {
  [EnumResourceType.Service]: [
    "modules",
    "entities",
    "roles",
    "plugins",
    "git",
    "connections",
    "settings",
  ],
  [EnumResourceType.ServiceTemplate]: ["plugins", "settings"],
  [EnumResourceType.ProjectConfiguration]: ["git", "settings"],
  [EnumResourceType.MessageBroker]: ["topics", "services", "git", "settings"],
  [EnumResourceType.PluginRepository]: ["privatePlugins", "git2", "settings"],
};

export const linksMap: {
  [key in MenuItemLinks]: {
    title: string;
    icon: string;
    to: string;
    license?: BillingFeature;
  };
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
    title: "Sync with Git",
    icon: "pending_changes",
    to: "/git-sync",
  },
  git2: {
    title: "Git Repo",
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
    title: "Connected Services",
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
  modules: {
    title: "APIs",
    icon: "box",
    to: "/modules",
    license: BillingFeature.CustomActions,
  },
  privatePlugins: {
    title: "Private Plugins",
    icon: "plugins",
    to: "/private-plugins",
  },
};

export const setResourceUrlLink = (
  workspace: string,
  project: string,
  resource: string,
  itemUrl: string,
  isPlatformConsole = false
): string =>
  !isPlatformConsole
    ? `/${workspace}/${project}/${resource}${itemUrl}`
    : `/${workspace}/platform/${project}/${resource}${itemUrl}`;
