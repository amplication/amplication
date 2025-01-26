import { Role, Team } from "../../models";
import { Blueprint } from "../../prisma";
import { EnumResourceType } from "../resource/dto/EnumResourceType";

type NoneInputFields = "id" | "createdAt" | "updatedAt" | "workspaceId";

type DefaultTeamWithRole = {
  team: Omit<Team, NoneInputFields>;
  role: Omit<Role, NoneInputFields>;
};

type DefaultBlueprint = Omit<Blueprint, NoneInputFields>;

export const DEFAULT_TEAMS_AND_ROLES: Record<string, DefaultTeamWithRole> = {
  admins: {
    team: {
      name: "Admins",
      description: "Admins team",
      color: "#ACD371",
    },
    role: {
      name: "Admins",
      key: "ADMINS",
      description: "Can access and manage all resources",
      permissions: ["*"],
    },
  },
  platform: {
    team: {
      name: "Platform Engineers",
      description: "Platform Engineers team",
      color: "#20A4F3",
    },
    role: {
      name: "Platform Engineers",
      key: "PLATFORM_ENGINEERS",
      description: "Can create and manage Plugins and Templates",
      permissions: [
        "project.create",
        "privatePlugin.create",
        "privatePlugin.delete",
        "privatePlugin.edit",
        "privatePlugin.version.create",
        "privatePlugin.version.edit",
        "resource.createTemplate",
      ],
    },
  },
  developers: {
    team: {
      name: "Developers",
      description: "Developers team",
      color: "#F6AB50",
    },
    role: {
      name: "Developer",
      key: "DEVELOPER",
      description: "Can create and build resources and services",
      permissions: [
        "project.create",
        "resource.*.edit",
        "resource.delete",
        "resource.create",
        "resource.createFromTemplate",
        "resource.createMessageBroker",
        "resource.createService",
        "resource.createTemplate",
      ],
    },
  },
};

export const DEFAULT_BLUEPRINTS: DefaultBlueprint[] = [
  {
    name: ".NET Service (Amplication's Standard)",
    deletedAt: undefined,
    description: ".NET service based on Amplication's standard",
    color: "#6E7FF6",
    key: "DOTNET_SERVICE_STANDARD",
    enabled: true,
    relations: [],
    resourceType: EnumResourceType.Service,
    codeGeneratorName: "DotNET",
  },
  {
    name: "Node.js Service (Amplication's Standard)",
    deletedAt: undefined,
    description: "Node.js service based on Amplication's standard",
    color: "#ACD371",
    key: "NODEJS_SERVICE_STANDARD",
    enabled: true,
    relations: [],
    resourceType: EnumResourceType.Service,
    codeGeneratorName: "NodeJS",
  },
  {
    name: "Message Broker (Amplication's Standard)",
    deletedAt: undefined,
    description: "Message Broker based on Amplication's standard",
    color: "#ff6e6e",
    key: "MESSAGE_BROKER_STANDARD",
    enabled: true,
    relations: [],
    resourceType: EnumResourceType.MessageBroker,
    codeGeneratorName: "Blueprint",
  },
];
