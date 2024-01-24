import { Prisma } from "../../prisma";
import { EnumActionLogLevel, EnumActionStepStatus } from "../action/dto";

export const PROCESSING_PRISMA_SCHEMA = "PROCESSING_PRISMA_SCHEMA";

export const initialStepData: Prisma.ActionStepCreateWithoutActionInput = {
  name: PROCESSING_PRISMA_SCHEMA,
  message: "Import Prisma schema file",
  status: EnumActionStepStatus.Running,
  completedAt: new Date(),
  logs: {
    create: [
      {
        message: "Starting to create entities from Prisma schema",
        level: EnumActionLogLevel.Info,
        meta: {},
      },
    ],
  },
};
