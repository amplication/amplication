export class InvalidFeatureFlagsEnvironmentVariableError extends Error {
  constructor(value: string) {
    super(
      `Feature flags environment variable should contain a valid JSON object. Instead received: ${value}`
    );
  }
}
