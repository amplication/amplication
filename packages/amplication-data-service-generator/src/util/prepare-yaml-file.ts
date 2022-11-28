import { merge } from "lodash";
import YAML from "yaml";

export function prepareYamlFile(
  yamlFileContent: string,
  updateProperties: { [key: string]: any }[]
): string {
  const parsed = YAML.parse(yamlFileContent);
  updateProperties &&
    updateProperties.forEach((updateProperty) => merge(parsed, updateProperty));

  return YAML.stringify(parsed, { nullStr: "~" });
}
