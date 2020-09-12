import { Permission } from "accesscontrol";

/**
 * @returns attributes not allowed to appear on given data according to given
 * attributeMatchers
 */
export function getInvalidAttributes(
  permission: Permission,
  data: Record<string, unknown>
): string[] {
  const filteredData = permission.filter(data);
  return Object.keys(data).filter((key) => !(key in filteredData));
}
