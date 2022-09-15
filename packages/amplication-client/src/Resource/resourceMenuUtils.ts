import { EnumResourceType } from "../models";

export type MenuItemLinks = "entities" | "roles" | "github" | "settings";

export const resourceMenuLayout: { [key: string]: string[] } = {
  [EnumResourceType.Service]: [
    "entities",
    "roles",
    "connections",
    "github",
    "settings",
    "plugins",
  ],
  [EnumResourceType.ProjectConfiguration]: ["github", "settings", "plugins"],
  [EnumResourceType.MessageBroker]: [
    "topics",
    "services",
    "github",
    "settings",
    "plugins",
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
) => `/${workspace}/${project}/${resource}${iconUrl}`;
