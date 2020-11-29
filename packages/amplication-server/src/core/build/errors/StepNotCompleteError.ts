import { EnumActionStepStatus } from '../../action/dto/EnumActionStepStatus';

export class StepNotCompleteError extends Error {
  constructor(stepName: string, status: EnumActionStepStatus) {
    super(
      `Cannot get step ${stepName} as it's current status is "${status}" and not "${EnumActionStepStatus.Success}"`
    );
  }
}
