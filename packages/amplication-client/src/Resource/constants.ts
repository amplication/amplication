import * as models from "../models";

export function preparePluginRepositoryObject(
  projectId: string
): models.ResourceCreateInput {
  return {
    name: "Plugin Repository",
    description: "",
    resourceType: models.EnumResourceType.PluginRepository,
    blueprint: {
      connect: {
        id: "none",
      },
    },
    project: {
      connect: {
        id: projectId,
      },
    },
  };
}

export function prepareComponentObject(
  projectId: string,
  blueprint: models.Blueprint
): models.ResourceCreateInput {
  return {
    name: `${blueprint.name}-name`,
    description: "",
    resourceType: models.EnumResourceType.Component,
    blueprint: {
      connect: {
        id: blueprint.id,
      },
    },
    project: {
      connect: {
        id: projectId,
      },
    },
  };
}

export const resourceThemeMap: {
  [key in models.EnumResourceType]: {
    icon: string;
    color: string;
    name: string;
  };
} = {
  [models.EnumResourceType.ProjectConfiguration]: {
    icon: "app-settings",
    color: "#f685a1",
    name: "Project",
  },
  [models.EnumResourceType.Service]: {
    icon: "code",
    color: "#A787FF",
    name: "Service",
  },
  [models.EnumResourceType.MessageBroker]: {
    icon: "queue",
    color: "#8DD9B9",
    name: "Message Broker",
  },
  [models.EnumResourceType.PluginRepository]: {
    icon: "plugin",
    color: "#53dbee",
    name: "Plugin Repository",
  },
  [models.EnumResourceType.ServiceTemplate]: {
    icon: "services",
    color: "#f6aa50",
    name: "Template",
  },
  [models.EnumResourceType.Component]: {
    icon: "blueprint",
    color: "#20A4F3",
    name: "Component",
  },
};
