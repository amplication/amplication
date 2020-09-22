/**
 * Maps array values to Prisma's list set array value format
 * @param object object to update array values for
 * @returns object with updated array values
 */
export function mapArrayValuesToSetArrayValues<T extends Object>(
  object: T
): { [K in keyof T]: T[K] extends Array<infer A> ? { set: T[K] } : T[K] } {
  // @ts-ignore
  return Object.fromEntries(
    Object.entries(object).map(([key, value]) => {
      if (Array.isArray(value)) {
        return [key, { set: value }];
      }
      return [key, value];
    })
  );
}
