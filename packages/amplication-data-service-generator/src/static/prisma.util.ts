/**
 * Converts DTO values to Prisma's format.
 * Array values are converted to set array value format.
 * Object values are converted to connect object value format.
 * @param object object to update array values for
 * @returns object with updated array values
 */
export function convertDTOToPrismaFormat<T extends Object>(
  object: T
): {
  [K in keyof T]: T[K] extends Array<infer A> | undefined
    ? { set: T[K] }
    : T[K] extends Object
    ? { connect: T[K] }
    : T[K];
} {
  // @ts-ignore
  return Object.fromEntries(
    Object.entries(object).map(([key, value]) => {
      if (Array.isArray(value)) {
        return [key, { set: value }];
      }
      if (typeof value === "object" && value !== null) {
        return [key, { connect: value }];
      }
      return [key, value];
    })
  );
}
