import { Prisma } from "../../prisma";
import { EnumActionLogLevel, EnumActionStepStatus } from "../action/dto";

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

export const VALIDATE_PROJECT_REDESIGN_CHANGES_DATA =
  "APPLYING_PROJECT_REDESIGN_CHANGES";

export const REDESIGN_PROJECT_VALIDATION_DATA_INITIAL_STEP_DATA: Prisma.ActionStepCreateWithoutActionInput =
  {
    name: VALIDATE_PROJECT_REDESIGN_CHANGES_DATA,
    message: "Validate project redesign changes data",
    status: EnumActionStepStatus.Running,
    completedAt: undefined,
    logs: {
      create: [
        {
          message: "Starting to validate project redesign changes data",
          level: EnumActionLogLevel.Info,
          meta: {},
        },
      ],
    },
  };
