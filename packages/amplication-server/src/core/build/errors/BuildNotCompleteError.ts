import { EnumBuildStatus } from '../dto/EnumBuildStatus';

export class BuildNotCompleteError extends Error {
  constructor(buildId: string, status: EnumBuildStatus) {
    super(
      `Cannot get build ${buildId} as it's current status is "${status}" and not "${EnumBuildStatus.Completed}"`
    );
  }
}
