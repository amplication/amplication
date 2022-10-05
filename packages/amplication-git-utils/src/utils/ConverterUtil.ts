export class ConverterUtil {
  public static convertToNumber(value: string): number {
    const result = parseInt(value);
    if (isNaN(result)) {
      throw new Error("GitHub App installation identifier is invalid");
    }
    return result;
  }
}
