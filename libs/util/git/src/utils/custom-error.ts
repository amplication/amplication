const DEFAULT_CUSTOM_ERROR = "Custom Error";
const NOT_IMPLEMENTED_ERROR = "Method not implemented.";

export class CustomError extends Error {
  constructor(message: string, private options: Record<string, unknown> = {}) {
    super(message);
    this.message = message || DEFAULT_CUSTOM_ERROR;
    this.options = options;
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

export const NotImplementedError = new CustomError(NOT_IMPLEMENTED_ERROR);
