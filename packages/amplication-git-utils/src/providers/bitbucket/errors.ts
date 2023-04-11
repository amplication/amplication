export class BitbucketGenericError extends Error {
  constructor(message: string, options: Record<string, unknown> = {}) {
    super(message);
    Object.assign(this, { ...options });
    Object.setPrototypeOf(this, BitbucketGenericError.prototype);
  }
}
export class BitbucketNotFoundError extends BitbucketGenericError {
  constructor() {
    super("404 Not found");
    Object.setPrototypeOf(this, BitbucketNotFoundError.prototype);
  }
}
