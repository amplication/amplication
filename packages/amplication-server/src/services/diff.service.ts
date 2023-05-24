import { isEqualWith, IsEqualCustomizer } from "lodash";

export class DiffService {
  /**
   * Checks if two objects are different by using a diff algorithm and parsing the result.
   * @param value The value to compare
   * @param otherValue The other value to compare
   * @param ignoredProperties An array of properties we don't want to compare
   * @returns Whether the two provided objects are different
   */
  public areDifferent(
    value: unknown,
    otherValue: unknown,
    ignoredProperties: string[] = []
  ): boolean {
    return !isEqualWith(
      value,
      otherValue,
      this.createIgnorePropertiesisEqualCustomizer(ignoredProperties)
    );
  }
  /**
   *  Creates an equality comparison customizer function.
   *  The returned function will :
   *  - Consider values equal (return true) if their key is in ignoredProperties (it won't compare them)
   *  - Tell the isEqualWith function to compare them by returning undefined
   * @param ignoredProperties An array of properties we don't want to compare
   * @returns An equality comparison customizer function
   */
  private createIgnorePropertiesisEqualCustomizer(
    ignoredProperties: string[]
  ): IsEqualCustomizer {
    return (value, other, indexOrKey) =>
      (typeof indexOrKey === "string" &&
        ignoredProperties.includes(indexOrKey)) ||
      undefined;
  }
}
