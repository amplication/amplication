import { AmplicationError } from "./AmplicationError";

export class BillingLimitationError extends AmplicationError {
  constructor(message: string, public readonly bypassAllowed = false) {
    super(message);
  }
}
