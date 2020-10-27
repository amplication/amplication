export class InvalidDeployProviderState extends Error {
  constructor(statusQuery: object, message: string) {
    super(`Invalid status query: ${JSON.stringify(statusQuery)}. ${message}`);
  }
}
