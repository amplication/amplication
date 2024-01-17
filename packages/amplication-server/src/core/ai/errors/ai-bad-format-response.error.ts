export class AiBadFormatResponseError extends Error {
  private aiResponse: string;

  constructor(response: string, originalError?: Error) {
    super("Bad format response from AI");
    this.name = "AiError";
    this.aiResponse = response;
    this.stack = originalError?.stack;
  }
}
