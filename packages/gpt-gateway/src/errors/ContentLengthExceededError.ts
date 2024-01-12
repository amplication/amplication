export class ContentLengthExceededError extends Error {
  constructor(message?: string) {
    message = message || "Content length exceeded";
    super(message);
    this.name = "ContentLengthExceeded";
  }
}
