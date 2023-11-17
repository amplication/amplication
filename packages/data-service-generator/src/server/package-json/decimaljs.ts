import DsgContext from "../../dsg-context";

export const decimalJsPackage = {
  name: "decimal.js",
  version: "10.4.3",
};

export function addDecimalJSPackageIfNecessary(
  updateProperties: {
    [key: string]: any;
  }[]
): void {
  const { hasDecimalFields } = DsgContext.getInstance;
  if (!hasDecimalFields) return;
  updateProperties.push({
    dependencies: {
      [decimalJsPackage.name]: decimalJsPackage.version,
    },
  });
}
