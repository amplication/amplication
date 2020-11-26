import { EnumActionStepStatus } from '../../action/dto/EnumActionStepStatus';

export class BuildNotCompleteError extends Error {
  constructor(buildId: string, status: EnumActionStepStatus) {
    super(
      `Cannot get build ${buildId} as it's current status is "${status}" and not "${EnumActionStepStatus.Success}"`
    );
  }
}
