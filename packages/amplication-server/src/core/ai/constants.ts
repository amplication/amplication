import { Prisma } from "../../prisma";
import { EnumActionStepStatus } from "../action/dto";
import { EnumUserActionType } from "../userAction/types";

export const GENERATING_BTM_RESOURCE_RECOMMENDATION_STEP_NAME =
  "GENERATING_BTM_RESOURCE_RECOMMENDATION";

export const GENERATING_BTM_RESOURCE_RECOMMENDATION_USER_ACTION_TYPE =
  EnumUserActionType.BreakTheMonolith;

export const initialStepData: Prisma.ActionStepCreateWithoutActionInput = {
  name: GENERATING_BTM_RESOURCE_RECOMMENDATION_STEP_NAME,
  message: "Emitting event to generate BTM resource recommendation",
  status: EnumActionStepStatus.Waiting,
};
