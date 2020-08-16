export class BuildFailedError extends Error {
  constructor(buildId: string) {
    super(`Cannot get signed URL for build ${buildId} as it failed`);
  }
}
