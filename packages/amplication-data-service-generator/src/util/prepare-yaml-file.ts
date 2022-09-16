import YAML from "yaml";
import { set } from "lodash";

export function prepareYamlFile(
  yamlFileContent: string,
  updateProperties: { path: string; value: any }[]
): string {
  const parsed = YAML.parse(yamlFileContent);
  if (!updateProperties.length) return YAML.stringify(parsed, { nullStr: "~" });

  const updated = updateProperties.map((item) =>
    set(parsed, item.path, item.value)
  )[0];
  
  return YAML.stringify(updated, { nullStr: "~" });
}
