import YAML from "yaml";
import { set } from "lodash";

export function prepareYamlFile(
  yamlFileContent: string,
  updateProperties: { path: string; value: any }[]
): string {
  const parsed = YAML.parse(yamlFileContent);
  updateProperties.forEach(({ path, value }) => set(parsed, path, value));

  return YAML.stringify(parsed, { nullStr: "~" });
}
