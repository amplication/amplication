export class BuildNotFoundError extends Error {
  constructor(buildId: string) {
    super(`Build with the ID ${buildId} was not found`);
  }
}
