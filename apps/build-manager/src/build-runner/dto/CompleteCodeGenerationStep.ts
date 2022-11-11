import { ActionStepStatus } from "./ActionStepStatus";

export class CompleteCodeGenerationStep {
  buildId!: string;
  status!: ActionStepStatus.Success | ActionStepStatus.Failed;
}
