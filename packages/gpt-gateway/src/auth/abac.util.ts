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
  // The structuredClone call is necessary because the
  // `Permission.filter` function doesn't consider objects
  // with null prototypes. And in graphql requests, the
  // object passed here by the request interceptor is an object
  // with a null prototype.
  const filteredData = permission.filter(structuredClone(data));
  return Object.keys(data).filter((key) => !(key in filteredData));
}
