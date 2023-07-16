import { registerEnumType } from "@nestjs/graphql";
import { EnumActionLogLevel, EnumActionStepStatus } from "../action/dto";

export enum EnumUserActionType {
  DBSchemaImport = "DBSchemaImport",
}

registerEnumType(EnumUserActionType, {
  name: "EnumUserActionType",
});

export enum EnumUserActionStatus {
  Running = "Running",
  Completed = "Completed",
  Failed = "Failed",
  Invalid = "Invalid",
}

registerEnumType(EnumUserActionStatus, {
  name: "EnumUserActionStatus",
});

export type ActionContext = {
  logByStep: (level: EnumActionLogLevel, message: string) => Promise<void>;
  onComplete: (
    status: EnumActionStepStatus.Success | EnumActionStepStatus.Failed
  ) => Promise<void>;
};
