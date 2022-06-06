export class CustomError extends Error {
  constructor(message: string, cause?: any) {
    super(`${message}: ${cause}`);
  }
}
