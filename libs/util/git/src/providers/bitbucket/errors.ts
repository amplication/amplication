export class BitbucketGenericError extends Error {
  constructor(message: string, options: Record<string, unknown> = {}) {
    super(message);
    Object.assign(this, { ...options });
    Object.setPrototypeOf(this, BitbucketGenericError.prototype);
  }
}
export class BitbucketNotFoundError extends BitbucketGenericError {
  constructor(options: Record<string, unknown> = {}) {
    super("404 Not found");
    Object.assign(this, { ...options });
    Object.setPrototypeOf(this, BitbucketNotFoundError.prototype);
  }
}
