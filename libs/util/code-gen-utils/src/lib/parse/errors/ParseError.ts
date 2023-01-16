export class ParseError extends SyntaxError {
  constructor(message: string, source: string) {
    super(`${message}\nSource:\n${source}`);
  }
}
