export class MissingBuildFiles extends Error {
  constructor(buildId: string) {
    super(`Build path for build: ${buildId} does not exist`);
  }
}
