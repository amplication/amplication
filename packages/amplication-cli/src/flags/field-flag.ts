import { flags } from "@oclif/command";

function getField(params: any): string | undefined {
  const envField = process.env.AMP_CURRENT_FIELD;
  if (envField) return envField;

  const configField = params?.configJSON?.AMP_CURRENT_FIELD;
  if (configField) return configField;

  return undefined;
}
export const field = flags.build({
  char: "i",
  description: "ID of the field",
  default: getField,
});
