import { AmplicationError } from 'src/errors/AmplicationError';

export class InvalidSourceControl extends AmplicationError {
  constructor() {
    super("Didn't got a valid source control service");
  }
}
