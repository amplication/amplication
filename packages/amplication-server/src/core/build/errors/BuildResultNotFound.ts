export class BuildResultNotFound extends Error {
  constructor(buildId: string) {
    super(`No result for build ${buildId} was found`);
  }
}
