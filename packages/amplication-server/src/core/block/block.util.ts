import { JsonValue } from "type-fest";

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
