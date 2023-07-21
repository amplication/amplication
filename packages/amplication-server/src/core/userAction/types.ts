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
  onEmitUserActionLog: (
    message: string,
    level: EnumActionLogLevel,
    status?: EnumActionStepStatus,
    isStepCompleted?: boolean
  ) => Promise<void>;
  onCompleteWithLog: (
    message: string,
    level: EnumActionLogLevel,
    status: EnumActionStepStatus.Success | EnumActionStepStatus.Failed,
    isStepCompleted: boolean
  ) => Promise<void>;
};
