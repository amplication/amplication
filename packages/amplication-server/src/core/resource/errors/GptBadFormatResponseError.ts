export class GptBadFormatResponseError extends Error {
  constructor(private readonly promptResponse: string, originalError?: Error) {
    super("Bad format response from AI");
    this.name = "AiError";
    this.stack = originalError?.stack;
  }
}
