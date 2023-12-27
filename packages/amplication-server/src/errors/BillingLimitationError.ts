import { BillingFeature } from "@amplication/util-billing-types";
import { AmplicationError } from "./AmplicationError";

export class BillingLimitationError extends AmplicationError {
  constructor(
    message: string,
    public readonly billingFeature: BillingFeature,
    public readonly bypassAllowed = true
  ) {
    super(`LimitationError: ${message}`);
  }
}
