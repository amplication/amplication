export class InvalidDefaultError extends Error {
  constructor(name: string) {
    super(`Default builder: "${name}" must exist in provided builders object`);
  }
}
