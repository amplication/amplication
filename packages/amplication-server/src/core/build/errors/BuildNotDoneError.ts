export class BuildNotDoneError extends Error {
  constructor(buildId: string) {
    super(
      `Cannot get signed URL for build ${buildId} as it did not finish yet`
    );
  }
}
