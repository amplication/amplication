import { AmplicationError } from './AmplicationError';

export class DataConflictError extends AmplicationError {
  constructor(message: string) {
    super(message);
  }
}
