import { ImportSchemaInitial } from "./ImportSchemaInitial";
import { ImportSchemaInProgress } from "./ImportSchemaInProgress";
import { ImportSchemaSuccess } from "./ImportSchemaSuccess";
import { ImportSchemaFailure } from "./ImportSchemaFailure";
import { EnumUserActionStatus } from "../../models";

enum EnumUploadSchemaState {
  Initial = "Initial",
  InProgress = "InProgress",
  Success = "Success",
  Failure = "Failure",
}

export type UploadSchemaStateProps = {
  className?: string;
  message?: string;
};

export const uploadSchemaState: Record<
  EnumUploadSchemaState,
  (props: UploadSchemaStateProps) => JSX.Element
> = {
  Initial: (props) => ImportSchemaInitial(props),
  InProgress: (props) => ImportSchemaInProgress(props),
  Success: (props) => ImportSchemaSuccess(props),
  Failure: (props) => ImportSchemaFailure(props),
};

export const mapUserActionStatusToUploadSchemaState = (
  userActionStatus: EnumUserActionStatus
) => {
  switch (userActionStatus) {
    case EnumUserActionStatus.Running:
      return EnumUploadSchemaState.InProgress;
    case EnumUserActionStatus.Completed:
      return EnumUploadSchemaState.Success;
    case EnumUserActionStatus.Failed:
      return EnumUploadSchemaState.Failure;
    default:
      return EnumUploadSchemaState.Initial;
  }
};
