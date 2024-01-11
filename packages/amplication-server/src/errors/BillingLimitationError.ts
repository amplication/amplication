import { AmplicationError } from "./AmplicationError";
import { BillingFeature } from "@amplication/util-billing-types";

export class BillingLimitationError extends AmplicationError {
  constructor(
    message: string,
    public readonly billingFeature: BillingFeature,
    public readonly bypassAllowed = true
  ) {
    super(`LimitationError: ${message}`);
  }
}
