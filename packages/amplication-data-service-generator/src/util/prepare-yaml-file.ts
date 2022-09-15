import YAML from "yaml";
import { merge } from "lodash";

export function prepareYamlFile(
  yamlFileContent: string,
  updateProperties: { [key: string]: any }
): string {
  const parsed = YAML.parse(yamlFileContent);
  const updated = merge(updateProperties, parsed);

  return YAML.stringify(updated, { nullStr: "~" });
}
