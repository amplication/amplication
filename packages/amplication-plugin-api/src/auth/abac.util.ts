import { Permission } from "accesscontrol";

/**
 * @returns attributes not allowed to appear on given data according to given
 * attributeMatchers
 */
export function getInvalidAttributes(
  permission: Permission,
  // eslint-disable-next-line @typescript-eslint/ban-types
  data: Object
): string[] {
  const filteredData = permission.filter(data);
  return Object.keys(data).filter((key) => !(key in filteredData));
}
