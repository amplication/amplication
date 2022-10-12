import { merge } from "lodash";
import YAML from "yaml";

export function prepareYamlFile(
  yamlFileContent: string,
  updateProperties: { [key: string]: any }[]
): string {
  const parsed = YAML.parse(yamlFileContent);
  updateProperties && merge(parsed, ...updateProperties);

  return YAML.stringify(parsed, { nullStr: "~" });
}
