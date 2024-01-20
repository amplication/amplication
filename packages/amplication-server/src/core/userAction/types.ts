import { EnumActionLogLevel, EnumActionStepStatus } from "../action/dto";
import { UserActionLog } from "@amplication/schema-registry";
import { registerEnumType } from "@nestjs/graphql";

export enum EnumUserActionType {
  DBSchemaImport = "DBSchemaImport",
  GptConversation = "GptConversation",
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

export type UserActionLogKafkaEvent = (
  message: string,
  level: EnumActionLogLevel,
  status: EnumActionStepStatus,
  isStepCompleted: boolean
) => UserActionLog.KafkaEvent;

export type ActionContext = {
  onEmitUserActionLog: (
    message: string,
    level: EnumActionLogLevel,
    status?: EnumActionStepStatus,
    isStepCompleted?: boolean
  ) => Promise<void>;
};
