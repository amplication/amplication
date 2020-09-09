import { AmplicationError } from './AmplicationError';

export class AmplicationDataConflictError extends AmplicationError {
  constructor(message: string) {
    super(message);
  }
}
