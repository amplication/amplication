export class InvalidDefaultError extends Error {
  constructor(name: string) {
    super(
      `Default provider: "${name}" must exist in provided providers object`
    );
  }
}
