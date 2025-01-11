import { Prisma } from "../../prisma";
import { EnumActionLogLevel, EnumActionStepStatus } from "../action/dto";
import { EnumResourceType } from "./dto/EnumResourceType";
import { EnumResourceTypeGroup } from "./dto/EnumResourceTypeGroup";

export const DEFAULT_RESOURCE_COLORS = {
  projectConfiguration: "#FFBD70",
  service: "#20A4F3",
};

export const APPLYING_PROJECT_REDESIGN_CHANGES =
  "APPLYING_PROJECT_REDESIGN_CHANGES";

export const REDESIGN_PROJECT_INITIAL_STEP_DATA: Prisma.ActionStepCreateWithoutActionInput =
  {
    name: APPLYING_PROJECT_REDESIGN_CHANGES,
    message: "Applying project redesign changes",
    status: EnumActionStepStatus.Running,
    completedAt: undefined,
    logs: {
      create: [
        {
          message: "Starting to apply project redesign changes",
          level: EnumActionLogLevel.Info,
          meta: {},
        },
      ],
    },
  };

export const BREAK_THE_MONOLITH_AI_ERROR_MESSAGE =
  "Oops! Looks like our microservices suggestion feature hit a snag. Sorry for the hiccup! Please try again.";

export const RESOURCE_TYPE_TO_RESOURCE_TYPE_GROUP: {
  [key in EnumResourceType]: EnumResourceTypeGroup;
} = {
  [EnumResourceType.Service]: EnumResourceTypeGroup.Services,
  [EnumResourceType.MessageBroker]: EnumResourceTypeGroup.Services,
  [EnumResourceType.ProjectConfiguration]: EnumResourceTypeGroup.Services,
  [EnumResourceType.ServiceTemplate]: EnumResourceTypeGroup.Platform,
  [EnumResourceType.PluginRepository]: EnumResourceTypeGroup.Platform,
  [EnumResourceType.Component]: EnumResourceTypeGroup.Services,
};

export const RESOURCE_TYPE_GROUP_TO_RESOURCE_TYPE: {
  [key in EnumResourceTypeGroup]: EnumResourceType[];
} = Object.keys(RESOURCE_TYPE_TO_RESOURCE_TYPE_GROUP).reduce(
  (acc, resourceType) => {
    const resourceTypeGroup =
      RESOURCE_TYPE_TO_RESOURCE_TYPE_GROUP[resourceType];
    if (!acc[resourceTypeGroup]) {
      acc[resourceTypeGroup] = [];
    }
    acc[resourceTypeGroup].push(resourceType);
    return acc;
  },
  {} as { [key in EnumResourceTypeGroup]: EnumResourceType[] }
);
