import { AmplicationError } from "../../errors/AmplicationError";

export class DefaultModuleForEntityNotFoundError extends AmplicationError {
  constructor(entityId: string) {
    super(`Cannot find module for entity with entityId  + ${entityId}`);
  }
}
