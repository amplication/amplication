import { EnumActionStepStatus } from "../../action/dto";

export class CompleteCodeGenerationStep {
  buildId!: string;
  status!: EnumActionStepStatus.Success | EnumActionStepStatus.Failed;
}
