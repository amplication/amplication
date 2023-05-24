import { EnumActionStepStatus } from "./EnumActionStepStatus";
import { WhereUniqueInput } from "../../../dto";

export class CompleteStepArgs {
  status: EnumActionStepStatus;
  where!: WhereUniqueInput;
}
