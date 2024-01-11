import { WhereUniqueInput } from "../../../dto";
import { EnumActionStepStatus } from "./EnumActionStepStatus";

export class CompleteStepArgs {
  status: EnumActionStepStatus;
  where!: WhereUniqueInput;
}
