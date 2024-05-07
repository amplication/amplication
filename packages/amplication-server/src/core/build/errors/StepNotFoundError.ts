export class StepNotFoundError extends Error {
  constructor(stepName: string) {
    super(`Step with the name ${stepName} was not found`);
  }
}
