export class InvalidBuildProviderState extends Error {
  constructor(statusQuery: object, message: string) {
    super(`Invalid status query: ${JSON.stringify(statusQuery)}. ${message}`);
  }
}
