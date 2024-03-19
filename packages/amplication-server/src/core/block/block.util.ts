import { JsonValue } from "type-fest";
import { EnumBlockType } from "../../enums/EnumBlockType";
import { BillingFeature } from "@amplication/util-billing-types";

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

export async function validateEntitlement(
  blockType: EnumBlockType,
  workspaceId: string
): Promise<void> {
  switch (blockType) {
    case EnumBlockType.Module ||
      EnumBlockType.ModuleAction ||
      EnumBlockType.ModuleDto:
      return await validateCustomActionsEntitlement(workspaceId);
    default:
      return;
  }
}

async function validateCustomActionsEntitlement(
  workspaceId: string
): Promise<void> {
  try {
    const stiggClient = await this.getStiggClient();
    const customActionEntitlement = await stiggClient.getBooleanEntitlement({
      customerId: workspaceId,
      featureId: BillingFeature.CustomActions,
    });

    if (!customActionEntitlement.hasAccess) {
      throw new Error("User has no access to custom actions features");
    }
  } catch (error) {
    this.logger.error(error.message, error);
  }
}
