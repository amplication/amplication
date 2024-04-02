import { BillingFeature } from "@amplication/util-billing-types";
import { JsonValue } from "type-fest";
import { BillingService } from "../billing/billing.service";

const getType = (obj) =>
  Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();

export const mergeAllSettings = (
  oldSettings: JsonValue,
  newSettings: { [key: string]: any },
  keysToNotMerge: string[] = []
) => {
  const mergedObj = {};

  for (const [key, val] of Object.entries(oldSettings)) {
    const valueType = getType(val);
    if (
      keysToNotMerge.includes(key) &&
      Object.prototype.hasOwnProperty.call(newSettings, key)
    ) {
      mergedObj[key] = newSettings[key];
      continue;
    } else if (getType(newSettings[key]) === "array") {
      mergedObj[key] = newSettings[key];
      continue;
    } else if (valueType === "object") {
      mergedObj[key] = mergeAllSettings(
        val,
        newSettings[key] || {},
        keysToNotMerge
      );
      continue;
    } else {
      mergedObj[key] = Object.prototype.hasOwnProperty.call(newSettings, key)
        ? newSettings[key]
        : val;
    }
  }

  return {
    ...newSettings,
    ...mergedObj,
  };
};

export async function validateCustomActionsEntitlement(
  workspaceId: string,
  billingService: BillingService
): Promise<void> {
  try {
    const customActionEntitlement = await billingService.getBooleanEntitlement(
      workspaceId,
      BillingFeature.CustomActions
    );

    if (!customActionEntitlement.hasAccess) {
      throw new Error("User has no access to custom actions features");
    }
  } catch (error) {
    this.logger.error(error.message, error);
  }
}
