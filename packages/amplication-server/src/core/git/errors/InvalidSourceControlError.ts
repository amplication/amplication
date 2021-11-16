import { AmplicationError } from 'src/errors/AmplicationError';

// export class InvalidSourceControlError extends AmplicationError {
//   constructor() {
//     super("Didn't got a valid source control service");
//   }
// }
export const INVALID_SOURCE_CONTROL_ERROR = new AmplicationError(
  "Didn't got a valid source control service"
);
