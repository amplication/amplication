import { AmplicationError } from 'src/errors/AmplicationError';

export class ReservedEntityNameError extends AmplicationError {
  constructor(entityName: string) {
    super(`The entity name '${entityName}' is a reserved name`);
  }
}
