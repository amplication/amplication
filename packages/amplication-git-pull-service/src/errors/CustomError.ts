export class CustomError extends Error {
  constructor(message: string, cause: Error) {
    super(`${message}: ${cause}`);
  }
}
