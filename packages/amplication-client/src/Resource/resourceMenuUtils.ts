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
  | "pendingChanges"
  | "versions"
  | "templateResources"
  | "techDebt";

export const businessDomainRoutes = ["entities", "roles", "modules"];

export const resourceMenuLayout: {
  [key in EnumResourceType]: MenuItemLinks[];
} = {
  [EnumResourceType.Component]: [
    "plugins",
    "modules",
    "entities",
    "roles",
    "git",
    "techDebt",
    "settings",
  ],
  [EnumResourceType.Service]: [
    "plugins",
    "modules",
    "entities",
    "roles",
    "git",
    "techDebt",
    "connections",
    "settings",
  ],
  [EnumResourceType.ServiceTemplate]: [
    "plugins",
    "versions",
    "templateResources",
    "settings",
  ],
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
    title: "Git Settings",
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
  versions: {
    title: "Versions",
    icon: "publish",
    to: "/versions",
  },
  templateResources: {
    title: "Resources",
    icon: "services",
    to: "/template-resources",
  },
  techDebt: {
    title: "Tech Debt",
    icon: "cloud_drizzle",
    to: "/tech-debt",
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
