import { AmplicationError } from "../../errors/AmplicationError";

export class ReservedNameError extends AmplicationError {
  constructor(name: string) {
    super(`"${name}" is a reserved name and cannot be used.`);
  }
}
