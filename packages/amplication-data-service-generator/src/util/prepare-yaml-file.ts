import YAML from "yaml";
import { merge } from "lodash";

export function prepareYamlFile(
  yamlFileContent: string,
  updateProperties: { [key: string]: any }[]
): string {
  const parsed = YAML.parse(yamlFileContent);
  updateProperties &&
    updateProperties.forEach((updateProperty) => merge(parsed, updateProperty));

  return YAML.stringify(parsed, { nullStr: "~" });
}
