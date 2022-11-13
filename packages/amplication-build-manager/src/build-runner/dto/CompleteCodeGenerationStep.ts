import { ActionStepStatus } from "./ActionStepStatus";

export class CompleteCodeGenerationStep {
  resourceId!: string;
  buildId!: string;
  status!: ActionStepStatus.Success | ActionStepStatus.Failed;
}
